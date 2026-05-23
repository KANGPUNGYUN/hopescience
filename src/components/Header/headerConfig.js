/** CSS Header.css 미디어쿼리와 동일 — 이 너비 이하에서 모바일 헤더 */
export const HEADER_MOBILE_BREAKPOINT_PX = 1280;

export const NAV_ITEMS = [
  { label: "센터소개", to: "/" },
  { label: "교육과정", to: "/courses" },
  { label: "고객 후기", to: "/review" },
  { label: "자주묻는질문", to: "/faq" },
];

export const MOBILE_DRAWER_ITEMS = [
  { label: "교육 진행 현황", to: "/mypage/courses", icon: "courses" },
  { label: "수료 증서", to: "/mypage/certificates", icon: "certificate" },
  { label: "결제 내역", to: "/mypage/orders", icon: "receipt" },
  { label: "고객 후기", to: "/review", icon: "inquiry" },
];
