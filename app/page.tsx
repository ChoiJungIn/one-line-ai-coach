"use client";

// Design Ref: DESIGN §3.1 — 한 페이지(/)에 모든 것을 둔다. 상태는 이 파일이 보관한다.
// Plan: 작업 1 (기본 화면 틀), 4 (입력), 5 (결과), 6 (다시 받기)
import { useRef, useState } from "react";
import {
  DEFAULT_MODEL,
  DEFAULT_TONE,
  ERROR_MESSAGES,
  MAX_INPUT_LENGTH,
  MAX_RETRIES,
  NOTICE_MESSAGES,
  TIMEOUT_MS,
  WAIT_NOTICE_MS,
} from "@/lib/coach";
import CoachForm from "./components/CoachForm";
import CoachResult from "./components/CoachResult";
import StatusMessage, { type StatusKind } from "./components/StatusMessage";

type Message = { kind: StatusKind; text: string };

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  // 15초가 넘게 기다리는 중이면 true
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [result, setResult] = useState<{ inputText: string; coaching: string } | null>(null);
  // 같은 입력으로 "다시 받기"를 이미 누른 횟수 (0~3)
  const [retryCount, setRetryCount] = useState(0);
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

  /** 서버에 코칭을 요청한다. retry는 이번이 몇 번째 다시 받기인지 (첫 코칭은 0). */
  async function requestCoaching(input: string, retry: number) {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setWaiting(false);
    setMessage(null);

    // 15초가 지나면 대기 안내를 보여 준다
    const waitTimer = setTimeout(() => setWaiting(true), WAIT_NOTICE_MS);
    // 서버가 60초에 먼저 끝내지만, 서버가 답이 없는 경우를 대비해 화면에서도 기다리기를 멈춘다
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), TIMEOUT_MS + 2000);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          tone: DEFAULT_TONE,
          model: DEFAULT_MODEL,
          retryCount: retry,
        }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({
          kind: "error",
          text: data?.error?.message ?? ERROR_MESSAGES.UPSTREAM_ERROR,
        });
        return;
      }
      // 힘든 상황이면 코칭 대신 안내 문구가 온다. 결과·다시 받기 없이 안내만 보여 준다.
      if (data.coaching === NOTICE_MESSAGES.SAFETY) {
        setResult(null);
        setRetryCount(0);
        setMessage({ kind: "safety", text: NOTICE_MESSAGES.SAFETY });
        return;
      }
      setResult({ inputText: input, coaching: data.coaching });
      setRetryCount(retry);
    } catch (e) {
      const timedOut = e instanceof DOMException && e.name === "AbortError";
      setMessage({
        kind: "error",
        text: timedOut ? ERROR_MESSAGES.TIMEOUT : ERROR_MESSAGES.UPSTREAM_ERROR,
      });
    } finally {
      clearTimeout(waitTimer);
      clearTimeout(abortTimer);
      busy.current = false;
      setLoading(false);
      setWaiting(false);
    }
  }

  /** 같은 입력으로 다시 받기. 횟수를 다 썼으면 안내만 보여 준다. */
  function retryWith(input: string) {
    if (retryCount >= MAX_RETRIES) {
      setMessage({ kind: "info", text: ERROR_MESSAGES.TOO_MANY_RETRIES });
      return;
    }
    requestCoaching(input, retryCount + 1);
  }

  function handleSubmit() {
    if (busy.current) return;
    const input = text.trim();
    if (!input) {
      setMessage({ kind: "error", text: ERROR_MESSAGES.EMPTY_INPUT });
      return;
    }
    // 글 내용이 그대로면 "코칭 받기"를 눌러도 다시 받기로 센다. (횟수 제한을 피하지 못하게)
    if (result && input === result.inputText) {
      retryWith(input);
      return;
    }
    // 글 내용이 바뀌었으면 새 입력이므로 횟수가 다시 시작된다
    requestCoaching(input, 0);
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

      {loading && waiting && (
        <StatusMessage kind="wait" message={NOTICE_MESSAGES.WAITING} />
      )}
      {message && <StatusMessage kind={message.kind} message={message.text} />}

      {result && (
        <CoachResult
          inputText={result.inputText}
          coaching={result.coaching}
          remainingRetries={MAX_RETRIES - retryCount}
          loading={loading}
          onRetry={() => retryWith(result.inputText)}
        />
      )}
    </main>
  );
}
