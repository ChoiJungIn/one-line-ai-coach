// 서버 전용: 요청 횟수를 세어 요금이 함부로 나가지 않게 막는다. 화면(브라우저) 코드에서 가져다 쓰지 않는다.
// Design Ref: DESIGN §8 — 화면이 보내는 값만 믿지 않고 서버가 직접 센다.
//
// 한계: 횟수는 이 서버 프로그램의 메모리에만 있다. 서버를 다시 켜면 처음부터 다시 센다.
// 서버가 여러 대로 나뉘는 곳(서버리스 등)에 올리면 대수마다 따로 세므로, 그때는 공용 저장소로 바꿔야 한다.
import { createHash } from "node:crypto";
import {
  DAILY_CALL_LIMIT,
  DAILY_PREMIUM_LIMIT,
  MAX_RETRIES,
  RATE_LIMIT_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
  RETRY_WINDOW_MS,
} from "./coach";

type Store = {
  /** IP별 최근 요청 시각 */
  hits: Map<string, number[]>;
  /** (IP + 글 내용)별로 받은 횟수 */
  retries: Map<string, { count: number; resetAt: number }>;
  /** 오늘 OpenAI를 부른 전체 횟수 */
  daily: { day: string; count: number };
  /** 오늘 요금이 더 드는 모델을 부른 전체 횟수 */
  premium: { day: string; count: number };
};

// 개발 중 코드가 다시 불러와져도 횟수가 사라지지 않게 전역에 둔다
const holder = globalThis as typeof globalThis & { __coachGuard?: Store };
const store: Store = (holder.__coachGuard ??= {
  hits: new Map(),
  retries: new Map(),
  daily: { day: "", count: 0 },
  premium: { day: "", count: 0 },
});

/** 메모리가 끝없이 늘지 않도록 이 개수를 넘으면 오래된 것을 지운다 */
const MAX_ENTRIES = 5000;

/**
 * 요청한 사람을 구분하는 주소(IP).
 * 주의: 헤더 값은 직접 연결된 서버에서는 속일 수 있다. 그래서 하루 전체 상한(checkDaily)이 마지막 방어선이다.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "local";
}

/** 한 사람(IP)이 짧은 시간에 너무 많이 보내지 않았는지 확인한다. 통과하면 한 번 센다. */
export function checkRateLimit(ip: string, now = Date.now()): boolean {
  const recent = (store.hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_PER_WINDOW) {
    store.hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  store.hits.set(ip, recent);

  if (store.hits.size > MAX_ENTRIES) {
    for (const [key, times] of store.hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) store.hits.delete(key);
    }
  }
  return true;
}

/**
 * 같은 사람이 같은 글로 받은 횟수를 서버가 직접 센다. (첫 코칭 1번 + 다시 받기 MAX_RETRIES번)
 * 화면이 보내는 retryCount 값과 상관없이 적용된다. 통과하면 한 번 센다.
 */
export function checkRetries(ip: string, text: string, now = Date.now()): boolean {
  const key = `${ip}:${createHash("sha256").update(text).digest("hex")}`;
  const entry = store.retries.get(key);

  if (!entry || now >= entry.resetAt) {
    store.retries.set(key, { count: 1, resetAt: now + RETRY_WINDOW_MS });
  } else if (entry.count >= 1 + MAX_RETRIES) {
    return false;
  } else {
    entry.count += 1;
  }

  if (store.retries.size > MAX_ENTRIES) {
    for (const [k, v] of store.retries) {
      if (now >= v.resetAt) store.retries.delete(k);
    }
  }
  return true;
}

/** 오늘 OpenAI를 부른 전체 횟수가 상한을 넘지 않았는지 확인한다. 통과하면 한 번 센다. */
export function checkDaily(now = new Date()): boolean {
  const day = now.toLocaleDateString("sv-SE"); // 2026-11-02 모양
  if (store.daily.day !== day) store.daily = { day, count: 0 };
  if (store.daily.count >= DAILY_CALL_LIMIT) return false;
  store.daily.count += 1;
  return true;
}

/** 요금이 더 드는 모델의 하루 전체 호출 횟수가 상한을 넘지 않았는지 확인한다. 통과하면 한 번 센다. */
export function checkPremiumDaily(now = new Date()): boolean {
  const day = now.toLocaleDateString("sv-SE");
  if (store.premium.day !== day) store.premium = { day, count: 0 };
  if (store.premium.count >= DAILY_PREMIUM_LIMIT) return false;
  store.premium.count += 1;
  return true;
}

/**
 * 요청 본문을 최대 maxBytes까지만 읽는다. 넘으면 읽기를 멈추고 null을 돌려준다.
 * (content-length 헤더는 속일 수 있어서, 실제로 읽은 크기를 센다.)
 */
export async function readBodyLimited(request: Request, maxBytes: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}
