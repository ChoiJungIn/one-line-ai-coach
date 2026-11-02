// Design Ref: DESIGN §3.2, §7 — 대기·오류·안전 안내 문구를 한곳에서 보여 준다.
export type StatusKind = "info" | "wait" | "error" | "safety";

const KIND_STYLE: Record<StatusKind, string> = {
  info: "bg-brand-50 text-brand-700 ring-brand-100",
  wait: "bg-brand-50 text-brand-500 ring-brand-100",
  error: "bg-red-50 text-red-700 ring-red-200",
  safety: "bg-amber-50 text-amber-900 ring-amber-200",
};

export default function StatusMessage({
  kind,
  message,
}: {
  kind: StatusKind;
  message: string;
}) {
  return (
    <p
      // 오류는 화면 읽기 도구가 바로 읽어 주도록 alert로 표시한다
      role={kind === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm leading-6 ring-1 ${KIND_STYLE[kind]}`}
    >
      {message}
    </p>
  );
}
