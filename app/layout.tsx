import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// Design Ref: DESIGN §4.6, §5 — 기본 글씨체는 Noto Sans KR (분위기별 글씨체는 작업 11에서 추가)
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "오늘의 한 줄 AI 코치",
  description: "오늘의 상황을 한 줄로 적으면 AI가 응원과 작은 행동을 알려 주는 앱",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 한글이 깨지지 않도록 lang="ko"를 쓴다
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
