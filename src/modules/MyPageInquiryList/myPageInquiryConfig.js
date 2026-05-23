import { isCenterComment } from "../../pages/QnA/[inquiry_id]/qnaDetailConfig";

export const INQUIRY_TABS = [
  { key: "all", label: "전체" },
  { key: "pending", label: "답변 대기" },
  { key: "answered", label: "답변 완료" },
];

export const INQUIRIES_PER_PAGE = 5;

export function getMyUserId() {
  try {
    const data = sessionStorage.getItem("auth-storage");
    if (!data) return null;
    return JSON.parse(data).state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

export function hasCenterAnswer(inquiry) {
  const comments = inquiry?.comments ?? [];
  return comments.some((comment) => isCenterComment(comment));
}

export function getInquiryStatus(inquiry) {
  return hasCenterAnswer(inquiry) ? "answered" : "pending";
}

export function filterInquiriesByTab(inquiries, tabKey) {
  if (tabKey === "all") return inquiries;
  return inquiries.filter((item) => getInquiryStatus(item) === tabKey);
}

export function countInquiriesByTab(inquiries, tabKey) {
  return filterInquiriesByTab(inquiries, tabKey).length;
}

export function stripHtml(html) {
  if (!html) return "";
  if (typeof document === "undefined") {
    return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

export function extractImageUrls(html) {
  if (!html) return [];
  if (typeof document === "undefined") return [];
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return [...tmp.querySelectorAll("img")]
    .map((img) => img.getAttribute("src"))
    .filter(Boolean);
}

export function getCenterAnswerComment(inquiry) {
  const comments = inquiry?.comments ?? [];
  const center = comments.find((c) => isCenterComment(c));
  if (center) return center;
  return comments.length ? comments[comments.length - 1] : null;
}

export function formatCategoryLabel(category) {
  if (!category) return "";
  return `[${category}]`;
}
