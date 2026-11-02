// Design Ref: DESIGN §3.1, §4.5 — 받은 코칭을 최근 5개까지 쌓아서 보여 준다. (저장하지 않으며 새로고침하면 사라진다)
// Plan: 작업 9 (오늘의 코칭 모아 보기)
import { getMoodStyle, MAX_HISTORY, type Mood, type Tone } from "@/lib/coach";

/** 한 번 받은 코칭 기록. "다시 받기"로 받은 코칭도 각각 한 개로 센다. */
export type CoachEntry = {
  id: number;
  inputText: string;
  coaching: string;
  mood: Mood | null;
  tone: Tone;
};

export default function CoachHistory({ entries }: { entries: CoachEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section aria-label="오늘의 코칭 모아 보기" className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-brand-500">HISTORY</p>
        <h2 className="mt-1 text-xl font-bold text-brand-900">
          오늘의 코칭 모아 보기 <span className="text-sm font-normal text-foreground/60">(최근 {MAX_HISTORY}개)</span>
        </h2>
      </div>
      <ul className="flex flex-col gap-3">
        {/* 최신이 위에 오도록 받은 순서의 반대로 보여 준다 */}
        {entries
          .slice(-MAX_HISTORY)
          .reverse()
          .map((entry) => (
            <li
              key={entry.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-100"
            >
              <p className="text-sm text-foreground/60">
                {getMoodStyle(entry.mood).emoji} {entry.inputText}
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                  {entry.tone}
                </span>
              </p>
              <p className="mt-2 leading-7 text-brand-900">{entry.coaching}</p>
            </li>
          ))}
      </ul>
    </section>
  );
}
