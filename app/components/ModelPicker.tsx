"use client";

// Design Ref: DESIGN §3.1 — "AI 모델 고르기" 버튼. 누르면 3개 목록이 뜨고, 버튼에는 지금 고른 모델을 보여 준다.
// Plan: 작업 10 (AI 모델 고르기)
import { useEffect, useRef, useState } from "react";
import { MODELS, type ModelId } from "@/lib/coach";

type Props = {
  model: ModelId;
  onModelChange: (model: ModelId) => void;
  disabled: boolean;
};

export default function ModelPicker({ model, onModelChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = MODELS.find((m) => m.id === model) ?? MODELS[2];

  // 목록 바깥을 누르거나 Esc를 누르면 닫는다
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-brand-700 ring-1 ring-brand-500 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        AI 모델 고르기 · {current.label} ({current.id}) ▾
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="AI 모델"
          className="absolute left-0 top-full z-10 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-brand-100"
        >
          {MODELS.map((m) => (
            <li key={m.id} role="option" aria-selected={m.id === model}>
              <button
                type="button"
                onClick={() => {
                  onModelChange(m.id);
                  setOpen(false);
                }}
                className={`flex w-full flex-col px-4 py-3 text-left transition-colors hover:bg-brand-50 ${
                  m.id === model ? "bg-brand-50" : ""
                }`}
              >
                <span className="font-bold text-brand-900">
                  {m.id === model && "✓ "}
                  {m.label} — {m.id}
                </span>
                <span className="text-xs text-foreground/60">{m.note}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
