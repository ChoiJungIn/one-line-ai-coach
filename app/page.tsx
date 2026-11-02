// Design Ref: DESIGN §3.1 — 한 페이지(/)에 모든 것을 둔다. 모바일 폭을 먼저 만들고 PC에서는 가운데로 넓힌다.
// Plan: 작업 1 (기본 화면 틀) — 이후 작업에서 입력·결과·기록 영역이 이 틀 안에 들어온다.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12 md:max-w-2xl">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-brand-700 sm:text-4xl">
          오늘의 한 줄 AI 코치
        </h1>
        <p className="mt-3 text-base text-foreground/70">
          오늘의 상황이나 기분을 한 줄로 적어 보세요.
        </p>
      </header>
    </main>
  );
}
