"use client";

// Design Ref: DESIGN §3.1, §3.4 — 입력칸(200자), 남은 글자 수, "코칭 받기" 버튼
// Plan: 작업 4 (한 줄 입력 화면)
import Link from "next/link";
import { MAX_INPUT_LENGTH, TONES, type ModelId, type Tone } from "@/lib/coach";
import { LoadingKitten } from "./KittenScenes";
import ModelPicker from "./ModelPicker";

type Props = {
  text: string;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
  /** 코칭이 오는 동안 true. 이때는 버튼을 눌러도 아무 일도 일어나지 않는다. */
  loading: boolean;
  /** 지금 고른 말투 */
  tone: Tone;
  onToneChange: (tone: Tone) => void;
  /** 다시 받기 횟수를 다 썼을 때 true. 말투를 바꾸면 다시 받기로 세므로 함께 잠근다. */
  toneLocked: boolean;
  /** 지금 고른 AI 모델 */
  model: ModelId;
  onModelChange: (model: ModelId) => void;
};

export default function CoachForm({
  text,
  onTextChange,
  onSubmit,
  loading,
  tone,
  onToneChange,
  toneLocked,
  model,
  onModelChange,
}: Props) {
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
      {/* Plan: 작업 8 (말투 고르기) */}
      <fieldset className="flex flex-wrap items-center gap-2" disabled={loading || toneLocked}>
        <legend className="mb-2 text-sm font-medium text-brand-900">말투</legend>
        {TONES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={t === tone}
            onClick={() => onToneChange(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              t === tone
                ? "bg-brand-700 text-white ring-brand-700"
                : "bg-white text-brand-700 ring-brand-100 hover:bg-brand-50"
            }`}
          >
            {t}
          </button>
        ))}
      </fieldset>
      <ModelPicker model={model} onModelChange={onModelChange} disabled={loading} />
      <button
        type="submit"
        // 전송 중에는 눌러도 반응이 없도록 막는다 (요금 중복 방지)
        disabled={loading}
        className="rounded-full bg-brand-700 px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "코칭을 만들고 있어요…" : "코칭 받기"}
      </button>
      {/* 코칭을 기다리는 동안 버튼 바로 아래에서 아기 고양이가 털실을 굴린다 (작은 화면에서도 보이도록) */}
      {loading && <LoadingKitten />}
      {/* 입력이 외부(OpenAI)로 전송된다는 점을 미리 알린다 */}
      <p className="text-xs leading-5 text-foreground/60">
        입력한 내용은 코칭을 만들기 위해 OpenAI(해외 서비스)로 전송되며, 이 앱은 저장하지 않습니다.
        이름·연락처·건강 정보·회사 내부 정보는 적지 마세요.{" "}
        <Link href="/privacy" className="font-medium text-brand-700 underline underline-offset-2">
          자세히 보기
        </Link>
      </p>
    </form>
  );
}
