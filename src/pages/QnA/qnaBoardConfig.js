export {
  EDUCATION_REVIEW_API_ENABLED,
  EDUCATION_REVIEW_COMING_SOON_MODAL,
  EDUCATION_REVIEW_BOARD_HERO as QNA_BOARD_HERO,
  EDUCATION_REVIEW_BOARD_FILTERS as QNA_BOARD_FILTERS,
  EDUCATION_REVIEW_CATEGORY_LABELS,
  QNA_POSTS_PER_PAGE,
  getEducationReviewCategoryLabel,
  matchesEducationReviewFilter as matchesQnaFilter,
} from "./educationReviewBoardConfig";

export {
  REVIEW_BOARD_BASE_PATH,
  reviewBoardRoutes,
  isReviewBoardListPath,
  isReviewBoardNewPath,
  isReviewBoardDetailPath,
  getReviewBoardPostId,
} from "./reviewBoardRoutes";
