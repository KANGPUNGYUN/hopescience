import { Navigate, useParams } from "react-router-dom";

export const REVIEW_BOARD_BASE_PATH = "/review";

export const reviewBoardRoutes = {
  list: REVIEW_BOARD_BASE_PATH,
  new: `${REVIEW_BOARD_BASE_PATH}/new`,
  detail: (reviewId) => `${REVIEW_BOARD_BASE_PATH}/${reviewId}`,
  edit: (reviewId) => `${REVIEW_BOARD_BASE_PATH}/${reviewId}/edit`,
};

export function isReviewBoardListPath(pathname) {
  return pathname === REVIEW_BOARD_BASE_PATH;
}

export function isReviewBoardNewPath(pathname) {
  return pathname === reviewBoardRoutes.new;
}

export function isReviewBoardDetailPath(pathname, reviewId) {
  if (!reviewId) return false;
  return pathname === reviewBoardRoutes.detail(String(reviewId));
}

export function getReviewBoardPostId(params) {
  return params?.review_id ?? params?.inquiry_id ?? null;
}

export function LegacyQnAToReviewList() {
  return <Navigate to={REVIEW_BOARD_BASE_PATH} replace />;
}

export function LegacyQnAToReviewNew() {
  return <Navigate to={reviewBoardRoutes.new} replace />;
}

export function LegacyQnAToReviewDetail() {
  const { inquiry_id, review_id } = useParams();
  const id = review_id ?? inquiry_id;
  return <Navigate to={reviewBoardRoutes.detail(id)} replace />;
}

export function LegacyQnAToReviewEdit() {
  const { inquiry_id } = useParams();
  return <Navigate to={reviewBoardRoutes.edit(inquiry_id)} replace />;
}
