import { EDUCATION_REVIEW_BOARD_HERO } from "../educationReviewBoardConfig";

export const QNA_DETAIL_HERO = EDUCATION_REVIEW_BOARD_HERO;

export const QNA_CENTER_AUTHOR_NAME = "희망과학";

export function formatQnaDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${d}. ${hh}:${mm}`;
}

export function isCenterComment(comment) {
  const name = comment?.user_name ?? "";
  return name.includes("희망") || name.includes("Hope");
}
