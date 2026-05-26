/** 고객 후기 API 연동 */
export const EDUCATION_REVIEW_API_ENABLED = true;

export const EDUCATION_REVIEW_COMING_SOON_MODAL = {
  title: "안내",
  message: "해당 서비스는 준비 중입니다.",
};

export const EDUCATION_REVIEW_BOARD_HERO = {
  label: "CUSTOMER REVIEWS",
  title: "고객 후기",
  description:
    "실제 수강자들의 후기와 경험을 통해\n교육 과정에 대한 정보를 확인해보실 수 있습니다",
};

export const EDUCATION_REVIEW_BOARD_FILTERS = [
  { id: "all", label: "전체" },
  { id: "drunk-driving", label: "음주운전" },
  { id: "sex-offense", label: "성범죄" },
  { id: "other", label: "기타" },
];

export const EDUCATION_REVIEW_CATEGORY_LABELS = {
  "drunk-driving": "음주운전",
  "sex-offense": "성범죄",
  other: "기타",
};

export const QNA_POSTS_PER_PAGE = 10;

export function getEducationReviewCategoryLabel(category) {
  if (!category) return "기타";
  return EDUCATION_REVIEW_CATEGORY_LABELS[category] ?? category;
}

export function matchesEducationReviewFilter(item, filterId) {
  if (filterId === "all") return true;
  return item.category === filterId;
}
