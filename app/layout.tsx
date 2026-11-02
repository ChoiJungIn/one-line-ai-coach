import type { Metadata } from "next";
import { Black_Han_Sans, Gaegu, Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// Design Ref: DESIGN §4.6, §5 — 기본 글씨체는 Noto Sans KR
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Plan: 작업 11 — 분위기별 글씨체 (활력: 굵게, 차분: 명조, 위로: 손글씨). 집중은 기본 글씨체를 쓴다.
// 쓰는 글자(한글)만 내려받도록 preload는 끄고, 쓰일 때 불러온다.
const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-sans",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});
const gaegu = Gaegu({
  variable: "--font-gaegu",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "오늘의 한 줄 AI 코치",
  description: "오늘의 상황을 한 줄로 적으면 AI가 응원과 작은 행동을 알려 주는 앱",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 한글이 깨지지 않도록 lang="ko"를 쓴다
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${blackHanSans.variable} ${nanumMyeongjo.variable} ${gaegu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
