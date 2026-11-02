// Design Ref: DESIGN §3.1, §3.2 — 입력한 한 줄과 코칭 결과를 한 화면에 함께 보여 준다.
// Plan: 작업 5 (결과 화면)
type Props = {
  /** 사용자가 적은 한 줄 */
  inputText: string;
  /** AI가 만든 코칭 (응원 한 문장 + 작은 행동 한 문장) */
  coaching: string;
};

export default function CoachResult({ inputText, coaching }: Props) {
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
        <p className="text-xs font-bold tracking-[0.15em] text-brand-500">오늘의 코칭</p>
        <p className="mt-1 text-lg leading-8 text-brand-900">{coaching}</p>
      </div>
    </section>
  );
}
