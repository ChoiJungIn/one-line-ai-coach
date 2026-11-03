// 서버 전용: 요청마다 한 줄씩 기록을 남겨 악용을 알아챌 수 있게 한다. (Vercel에서는 프로젝트의 Logs에서 볼 수 있다)
// 기록하는 것: 시각, 접속 주소의 해시, 모델, 말투, 결과 코드, 걸린 시간, OpenAI가 준 상태값
// 기록하지 않는 것: 사용자가 입력한 글, 코칭 내용, 키
import { createHash } from "node:crypto";

export type CoachLog = {
  /** 결과 코드. 성공이면 "OK" */
  code: string;
  status: number;
  ip: string;
  ms: number;
  model?: string;
  tone?: string;
  /** OpenAI가 돌려준 HTTP 상태값 (불렀을 때만) */
  upstreamStatus?: number;
  safety?: boolean;
};

/** 접속 주소(IP)는 그대로 남기지 않고, 되돌릴 수 없게 짧은 해시로 바꿔 같은 사람인지만 구분한다 */
function shortHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 10);
}

export function logCoach(entry: CoachLog): void {
  const { ip, ...rest } = entry;
  console.info(
    JSON.stringify({ event: "coach", t: new Date().toISOString(), ip: shortHash(ip), ...rest }),
  );
}
