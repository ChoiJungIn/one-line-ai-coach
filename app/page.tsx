"use client";

// Design Ref: DESIGN §3.1 — 한 페이지(/)에 모든 것을 둔다. 상태는 이 파일이 보관한다.
// Plan: 작업 1 (기본 화면 틀), 작업 4 (한 줄 입력 화면)
import { useRef, useState } from "react";
import {
  DEFAULT_MODEL,
  DEFAULT_TONE,
  ERROR_MESSAGES,
  MAX_INPUT_LENGTH,
} from "@/lib/coach";
import CoachForm from "./components/CoachForm";
import StatusMessage, { type StatusKind } from "./components/StatusMessage";

type Message = { kind: StatusKind; text: string };

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [coaching, setCoaching] = useState<string | null>(null);
  // state는 다음 화면에서야 바뀌므로, 빠른 중복 클릭은 ref로도 막는다
  const busy = useRef(false);

  function handleTextChange(value: string) {
    const chars = [...value];
    if (chars.length > MAX_INPUT_LENGTH) {
      // 붙여넣기로 넘기면 앞 200자만 남기고 안내한다
      setText(chars.slice(0, MAX_INPUT_LENGTH).join(""));
      setMessage({ kind: "info", text: ERROR_MESSAGES.TOO_LONG });
      return;
    }
    setText(value);
    setMessage(null);
  }

  async function handleSubmit() {
    if (busy.current) return;
    const input = text.trim();
    if (!input) {
      setMessage({ kind: "error", text: ERROR_MESSAGES.EMPTY_INPUT });
      return;
    }

    busy.current = true;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          tone: DEFAULT_TONE,
          model: DEFAULT_MODEL,
          retryCount: 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({
          kind: "error",
          text: data?.error?.message ?? ERROR_MESSAGES.UPSTREAM_ERROR,
        });
        return;
      }
      setCoaching(data.coaching);
    } catch {
      setMessage({ kind: "error", text: ERROR_MESSAGES.UPSTREAM_ERROR });
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

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

      <CoachForm
        text={text}
        onTextChange={handleTextChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {message && <StatusMessage kind={message.kind} message={message.text} />}

      {/* 결과 화면은 작업 5에서 CoachResult로 바꾼다 */}
      {coaching && <p className="leading-7">{coaching}</p>}
    </main>
  );
}
