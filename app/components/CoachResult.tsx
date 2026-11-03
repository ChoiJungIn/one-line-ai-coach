// Design Ref: DESIGN §3.1, §3.2 — 입력한 한 줄과 코칭 결과를 한 화면에 함께 보여 준다.
// Plan: 작업 5 (결과 화면), 6 (다시 받기)
import { ERROR_MESSAGES, getMoodKitten, type Mood } from "@/lib/coach";
import Kitten from "./Kitten";

// 분위기별 글씨체 (app/layout.tsx에서 불러온 글씨체 변수). 못 고른 경우와 집중은 기본 글씨체.
const MOOD_FONT: Record<Mood, string> = {
  활력: "var(--font-black-han-sans)",
  차분: "var(--font-nanum-myeongjo)",
  위로: "var(--font-gaegu)",
  집중: "var(--font-noto-sans-kr)",
};
const DEFAULT_FONT = "var(--font-noto-sans-kr)";

type Props = {
  /** AI가 고른 분위기. 못 골랐으면 null이고 기본 모양을 쓴다. */
  mood: Mood | null;
  /** 사용자가 적은 한 줄 */
  inputText: string;
  /** AI가 만든 코칭 (응원 한 문장 + 작은 행동 한 문장) */
  coaching: string;
  /** 앞으로 더 받을 수 있는 "다시 받기" 횟수 (0~3) */
  remainingRetries: number;
  /** 코칭이 오는 동안 true */
  loading: boolean;
  onRetry: () => void;
};

export default function CoachResult({
  mood,
  inputText,
  coaching,
  remainingRetries,
  loading,
  onRetry,
}: Props) {
  const exhausted = remainingRetries <= 0;
  // 분위기에 맞는 아기 고양이 (못 골랐으면 기본 고양이)
  const kitten = getMoodKitten(mood);

  return (
    <section
      aria-label="코칭 결과"
      className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-md ring-1 ring-brand-100 sm:p-6"
    >
      <div>
        <p className="text-xs font-bold tracking-[0.15em] text-brand-500">내가 적은 한 줄</p>
        <p className="mt-1 leading-7 text-foreground/80">{inputText}</p>
      </div>
      <hr className="border-brand-100" />
      <div>
        <p className="text-xs font-bold tracking-[0.15em] text-brand-500">
          오늘의 코칭{mood ? ` · ${mood}` : ""}
        </p>
        <Kitten spec={kitten} size={104} label={kitten.name} className="kitten-bob mt-2" />
        <p
          className="mt-1 text-xl leading-9 text-brand-900"
          style={{ fontFamily: mood ? MOOD_FONT[mood] : DEFAULT_FONT }}
        >
          {coaching}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={onRetry}
          // 전송 중이거나 횟수를 다 썼으면 누를 수 없다
          disabled={loading || exhausted}
          className="rounded-full border border-brand-700 px-6 py-2 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          다시 받기 (남은 횟수 {remainingRetries})
        </button>
        {exhausted && (
          <p className="text-sm text-foreground/60">{ERROR_MESSAGES.TOO_MANY_RETRIES}</p>
        )}
      </div>
    </section>
  );
}
