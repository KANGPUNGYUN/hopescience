import { useCallback, useEffect, useState } from "react";
import { EDUCATION_REVIEW_API_ENABLED } from "./educationReviewBoardConfig";

/** 고객 후기 API 미연동 시 접근·액션마다 준비 중 모달 */
export function useEducationReviewComingSoon() {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  useEffect(() => {
    if (!EDUCATION_REVIEW_API_ENABLED) {
      setIsComingSoonOpen(true);
    }
  }, []);

  const openComingSoon = useCallback(() => {
    if (!EDUCATION_REVIEW_API_ENABLED) {
      setIsComingSoonOpen(true);
    }
  }, []);

  const closeComingSoon = useCallback(() => {
    setIsComingSoonOpen(false);
  }, []);

  return {
    isApiEnabled: EDUCATION_REVIEW_API_ENABLED,
    isComingSoonOpen,
    openComingSoon,
    closeComingSoon,
  };
}
