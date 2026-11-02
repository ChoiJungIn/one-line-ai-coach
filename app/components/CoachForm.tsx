"use client";

// Design Ref: DESIGN §3.1, §3.4 — 입력칸(200자), 남은 글자 수, "코칭 받기" 버튼
// Plan: 작업 4 (한 줄 입력 화면)
import { MAX_INPUT_LENGTH } from "@/lib/coach";

type Props = {
  text: string;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
  /** 코칭이 오는 동안 true. 이때는 버튼을 눌러도 아무 일도 일어나지 않는다. */
  loading: boolean;
};

export default function CoachForm({ text, onTextChange, onSubmit, loading }: Props) {
  const length = [...text].length;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="coach-text" className="text-sm font-medium text-brand-900">
        오늘의 한 줄
      </label>
      <textarea
        id="coach-text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={3}
        placeholder="예) 오늘 보고서 마감인데 마음이 급해요."
        className="w-full resize-none rounded-2xl bg-white p-4 leading-7 shadow-sm ring-1 ring-brand-100 outline-none focus:ring-2 focus:ring-brand-500"
      />
      <p className="text-right text-xs text-foreground/60" aria-live="polite">
        {length} / {MAX_INPUT_LENGTH}
      </p>
      <button
        type="submit"
        // 전송 중에는 눌러도 반응이 없도록 막는다 (요금 중복 방지)
        disabled={loading}
        className="rounded-full bg-brand-700 px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "코칭을 만들고 있어요…" : "코칭 받기"}
      </button>
    </form>
  );
}
