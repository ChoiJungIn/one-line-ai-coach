// Plan: 보안 점검 6번 — 입력이 어디로 가고 무엇이 남는지 사용자에게 알리는 안내 페이지
// 이 앱이 실제로 하는 일만 적는다. 법률 문서가 아니므로, 공개 전에는 필요한 검토를 따로 받는다.
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "입력 내용과 개인정보 안내 | 오늘의 한 줄 AI 코치",
  description: "한 줄 입력이 어디로 전송되고 무엇이 저장되는지 안내합니다.",
};

const SECTIONS = [
  {
    title: "무엇을 입력받나요",
    body: "오늘의 상황이나 기분을 적은 한 줄(최대 200자)만 받습니다. 로그인이나 회원가입은 없고, 이름이나 연락처를 묻지 않습니다.",
  },
  {
    title: "입력은 어디로 가나요",
    body: "코칭을 만들기 위해 입력한 한 줄이 이 앱의 서버를 거쳐 OpenAI(해외 서비스)로 전송됩니다. OpenAI에서의 처리와 보관은 OpenAI의 정책을 따릅니다.",
  },
  {
    title: "이 앱은 무엇을 저장하나요",
    body: "입력과 코칭 결과를 서버나 데이터베이스에 저장하지 않습니다. 화면에 보이는 기록은 브라우저를 새로고침하면 사라집니다. 다만 요청이 한꺼번에 몰리는 것을 막기 위해, 서버는 접속 주소(IP)별 요청 횟수와 입력 글의 해시값(복원할 수 없는 변환값)을 서버 프로그램의 메모리에 최대 1시간 동안 두며, 서버를 다시 켜면 사라집니다.",
  },
  {
    title: "이런 내용은 적지 마세요",
    body: "이름, 주민등록번호, 연락처, 건강 정보, 회사 내부 정보나 대외비처럼 밖으로 나가면 곤란한 내용은 적지 않습니다.",
  },
  {
    title: "코칭은 참고용입니다",
    body: "AI가 만든 짧은 응원과 제안이며, 의료·법률·투자 조언이 아닙니다. 힘든 마음이 계속되면 전문가나 상담 기관의 도움을 받아 보세요.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12 md:max-w-2xl">
      <header>
        <Link
          href="/"
          className="text-sm font-medium text-brand-700 underline underline-offset-2"
        >
          ← 코치로 돌아가기
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-700 sm:text-3xl">
          입력 내용과 개인정보 안내
        </h1>
        <p className="mt-2 text-foreground/70">
          한 줄을 적으면 어떻게 쓰이는지, 쉽게 정리했습니다.
        </p>
      </header>

      {SECTIONS.map((section) => (
        <section
          key={section.title}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-100"
        >
          <h2 className="text-lg font-bold text-brand-900">{section.title}</h2>
          <p className="mt-2 leading-7 text-foreground/80">{section.body}</p>
        </section>
      ))}
    </main>
  );
}
