import type { NextConfig } from "next";

// 모든 페이지와 API 응답에 붙는 보안 헤더 (공개 배포용)
const securityHeaders = [
  // 다른 사이트가 이 앱을 몰래 감싸서(iframe) 클릭을 유도하는 것을 막는다
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // 파일 종류를 브라우저가 멋대로 추측하지 않게 한다
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 다른 사이트로 이동할 때 주소의 자세한 부분을 넘기지 않는다
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 쓰지 않는 기기 기능은 막아 둔다
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // 앞으로 이 사이트는 https로만 접속하게 한다
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // "X-Powered-By: Next.js" 응답 헤더를 숨긴다
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
