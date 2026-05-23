import { FAQ_FETCH_SORT } from "../../pages/FAQ/faqPageConfig";

/** 홈 FAQ 섹션 — FAQ 목록 API와 동일 소스, 상위 3건만 표시 */
export const HOME_FAQ_FETCH_SKIP = 0;
export const HOME_FAQ_FETCH_LIMIT = 3;
export const HOME_FAQ_FETCH_SORT = FAQ_FETCH_SORT;

export function mapColumnToHomeFaqItem(column) {
  return {
    id: column.id,
    question: column.title,
    content: column.content ?? "",
  };
}
