// Design Ref: DESIGN §4.5, §4.6, §7 — 공통 값을 한 파일에 모아 화면과 서버가 같은 값을 쓰게 한다.
// Plan: 작업 2 (공통 값 정리)
// 이 파일에는 비밀 값(API 키 등)을 절대 넣지 않는다.

// ---------- 숫자 제한 ----------

/** 입력할 수 있는 최대 글자 수 */
export const MAX_INPUT_LENGTH = 200;

/** 같은 입력으로 "다시 받기"를 누를 수 있는 최대 횟수 */
export const MAX_RETRIES = 3;

/** 모아 보기 화면에 보여 주는 코칭 개수 */
export const MAX_HISTORY = 5;

/** 이 시간(밀리초)이 지나면 "조금 오래 걸리고 있어요" 대기 안내를 보여 준다 */
export const WAIT_NOTICE_MS = 15_000;

/** 이 시간(밀리초)이 지나면 기다리기를 멈추고 중단 안내를 보여 준다 */
export const TIMEOUT_MS = 60_000;

// ---------- 말투 ----------

export const TONES = ["다정", "단호", "유머"] as const;
export type Tone = (typeof TONES)[number];
export const DEFAULT_TONE: Tone = "다정";

export function isTone(value: unknown): value is Tone {
  return TONES.some((tone) => tone === value);
}

// ---------- AI 모델 ----------

export const MODELS = [
  { id: "gpt-6-astra", label: "좋은 것", note: "가장 똑똑하지만 비쌈" },
  { id: "gpt-6.1-sol", label: "중간", note: "균형 잡힌 선택" },
  { id: "gpt-4o-mini", label: "가성비", note: "가장 쌈" },
] as const;
export type ModelId = (typeof MODELS)[number]["id"];

/** 처음에는 가장 저렴한 가성비 모델로 시작한다 */
export const DEFAULT_MODEL: ModelId = "gpt-4o-mini";

/** 서버가 받은 모델 이름이 허용 목록에 있는지 확인할 때 쓴다 */
export function isModelId(value: unknown): value is ModelId {
  return MODELS.some((model) => model.id === value);
}

// ---------- 분위기: 이모지와 글씨체 ----------

export const MOODS = ["활력", "차분", "위로", "집중"] as const;
export type Mood = (typeof MOODS)[number];

export type MoodStyle = {
  emoji: string;
  /** 구글 글씨체 이름 (실제로 불러오는 것은 작업 11에서 한다) */
  fontName: string;
};

export const MOOD_STYLES: Record<Mood, MoodStyle> = {
  활력: { emoji: "☀️", fontName: "Black Han Sans" },
  차분: { emoji: "🌊", fontName: "Nanum Myeongjo" },
  위로: { emoji: "☕", fontName: "Gaegu" },
  집중: { emoji: "💡", fontName: "Noto Sans KR" },
};

/** 분위기를 고르지 못했을 때 쓰는 기본 모양 (이모지 없음) */
export const DEFAULT_MOOD_STYLE: MoodStyle = {
  emoji: "",
  fontName: "Noto Sans KR",
};

export function isMood(value: unknown): value is Mood {
  return MOODS.some((mood) => mood === value);
}

/** 이상한 값이 들어와도 기본 모양을 돌려준다 */
export function getMoodStyle(mood: unknown): MoodStyle {
  return isMood(mood) ? MOOD_STYLES[mood] : DEFAULT_MOOD_STYLE;
}

// ---------- 아기 고양이 그림 ----------
// 고양이는 AI가 그리지 않고, app/components/Kitten.tsx에 직접 그려 둔 그림을 쓴다. (요금이 들지 않는다)

export type KittenCoat = "orange" | "gray" | "white" | "black";
export type KittenFace = "happy" | "sleepy" | "love" | "curious";

export type KittenLook = { coat: KittenCoat; face: KittenFace; name: string };

/** 분위기마다 나오는 아기 고양이 */
export const MOOD_KITTENS: Record<Mood, KittenLook> = {
  활력: { coat: "orange", face: "happy", name: "신나는 주황 아기 고양이" },
  차분: { coat: "gray", face: "sleepy", name: "꾸벅꾸벅 졸린 회색 아기 고양이" },
  위로: { coat: "white", face: "love", name: "하트를 든 하얀 아기 고양이" },
  집중: { coat: "black", face: "curious", name: "눈이 반짝이는 검은 아기 고양이" },
};

/** 분위기를 고르지 못했을 때 나오는 아기 고양이 */
export const DEFAULT_KITTEN: KittenLook = {
  coat: "white",
  face: "curious",
  name: "호기심 많은 하얀 아기 고양이",
};

export function getMoodKitten(mood: unknown): KittenLook {
  return isMood(mood) ? MOOD_KITTENS[mood] : DEFAULT_KITTEN;
}

// ---------- 오류 코드와 안내 문구 ----------

export const ERROR_CODES = [
  "EMPTY_INPUT",
  "TOO_LONG",
  "INVALID_MODEL",
  "INVALID_TONE",
  "TOO_MANY_RETRIES",
  "TIMEOUT",
  "UPSTREAM_ERROR",
  "CONFIG_ERROR",
  "RATE_LIMITED",
  "DAILY_LIMIT",
  "BAD_REQUEST_TYPE",
  "FORBIDDEN_ORIGIN",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

/** 오류 코드별로 화면에 보여 주는 쉬운 한국어 문구 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  EMPTY_INPUT: "오늘의 한 줄을 입력해 주세요.",
  TOO_LONG: `${MAX_INPUT_LENGTH}자까지만 입력돼요.`,
  INVALID_MODEL: "선택한 모델을 쓸 수 없어요. 다른 모델을 골라 보세요.",
  INVALID_TONE: "선택한 말투를 쓸 수 없어요. 다른 말투를 골라 보세요.",
  TOO_MANY_RETRIES: "더 받으려면 새로 입력해 주세요.",
  TIMEOUT: "시간이 너무 오래 걸려 중단했어요. 다시 시도해 주세요.",
  UPSTREAM_ERROR: "지금은 코칭을 만들 수 없어요. 잠시 후 다시 시도해 주세요.",
  CONFIG_ERROR: "코칭 서비스 설정에 문제가 있어요. 키와 사용 한도를 확인해 주세요.",
  RATE_LIMITED: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.",
  DAILY_LIMIT: "오늘 쓸 수 있는 코칭 횟수를 모두 썼어요. 내일 다시 시도해 주세요.",
  BAD_REQUEST_TYPE: "요청 형식이 올바르지 않아요.",
  FORBIDDEN_ORIGIN: "허용되지 않은 곳에서 온 요청이에요.",
};

// ---------- 서버 보호 (공개 대비) ----------
// 이 값들은 서버(app/api/coach/route.ts, lib/guard.ts)에서 쓴다.

/** 한 사람(IP)이 이 시간(밀리초) 안에 보낼 수 있는 요청 수를 세는 구간 */
export const RATE_LIMIT_WINDOW_MS = 60_000;
/** 위 구간 안에서 한 사람(IP)이 보낼 수 있는 최대 요청 수 */
export const RATE_LIMIT_PER_WINDOW = 10;
/** 하루에 OpenAI를 부를 수 있는 전체 횟수 (모든 사람 합계) */
export const DAILY_CALL_LIMIT = 300;
/** 같은 사람이 같은 글로 받은 횟수를 기억하는 시간(밀리초) */
export const RETRY_WINDOW_MS = 60 * 60 * 1000;
/** OpenAI가 만들 수 있는 답변의 최대 길이(토큰). 긴 답변으로 요금이 늘지 않게 한다. */
export const MAX_OUTPUT_TOKENS = 400;
/** 코칭 문장으로 받아들이는 최대 글자 수. 넘으면 오류로 본다. */
export const MAX_COACH_CHARS = 300;

/** 오류가 아닌 안내 문구 */
export const NOTICE_MESSAGES = {
  /** 15초가 넘었을 때 */
  WAITING: "조금 오래 걸리고 있어요.",
  /** 힘든 상황이 심각해 보여 코칭 대신 보여 주는 안내 */
  SAFETY: "전문가나 상담 기관의 도움을 받아 보시는 것을 권해 드려요.",
} as const;
