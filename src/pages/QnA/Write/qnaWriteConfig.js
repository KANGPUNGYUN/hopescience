import { QNA_BOARD_HERO } from "../qnaBoardConfig";

export const QNA_WRITE_HERO = QNA_BOARD_HERO;

export const QNA_WRITE_PAGE_TITLE = {
  create: "고객 후기 작성",
  edit: "고객 후기 수정",
};

export const QNA_WRITE_CATEGORIES = [
  { value: "drunk-driving", label: "음주운전" },
  { value: "sex-offense", label: "성범죄" },
  { value: "other", label: "기타" },
];

/** 마이페이지 1:1 문의 작성 — Pencil zdJJd / gjDRp */
export const MYPAGE_INQUIRY_WRITE_CATEGORIES = [
  { value: "결제/환불", label: "결제/환불" },
  { value: "수강 오류", label: "수강 오류" },
  { value: "수료증 발급", label: "수료증 발급" },
  { value: "기타", label: "기타" },
];

export const MYPAGE_INQUIRY_WRITE_FORM_ID = "mypage-inquiry-write-form";

export const QNA_ATTACHMENT_HINT =
  "* JPG, PNG, PDF 파일 첨부 가능 · 최대 10MB";

export const QNA_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export const QNA_ATTACHMENT_ACCEPT = ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf";
