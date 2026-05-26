import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./HomeUserReviews.css";
import reviewsBg from "../../images/v2/reviews-bg.png";
import { HomeReviewCard } from "./HomeReviewCard";
import {
  ReviewsChevronLeftIcon,
  ReviewsChevronRightIcon,
  ReviewsPlusIcon,
} from "./HomeUserReviewsIcons";
import {
  HOME_USER_REVIEWS,
  HOME_USER_REVIEWS_FILTERS,
  HOME_USER_REVIEWS_SECTION,
} from "./homeUserReviewsConfig";
import { EDUCATION_REVIEW_API_ENABLED } from "../../pages/QnA/educationReviewBoardConfig";
import { inquiry } from "../../store";
import { stripHtml } from "../../modules/MyPageInquiryList/myPageInquiryConfig";
import { maskUserName } from "../../pages/Courses/[course_id]/courseDetailConfig";

const formatDateYYYYMMDD = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const CARD_GAP = 28;

export const HomeUserReviews = () => {
  const { label, title, description } = HOME_USER_REVIEWS_SECTION;
  const trackRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const getReviews = inquiry((state) => state.getReviews);
  const clearInquiries = inquiry((state) => state.clearInquiries);
  const inquiries = inquiry((state) => state.inquiries);
  const isLoading = inquiry((state) => state.isLoading);

  useEffect(() => {
    if (!EDUCATION_REVIEW_API_ENABLED) return;

    clearInquiries();

    getReviews(0, 12, "desc");
  }, [getReviews, clearInquiries]);

  const filteredReviews = useMemo(() => {
    const useApiReviews =
      EDUCATION_REVIEW_API_ENABLED &&
      !isLoading &&
      (inquiries?.length ?? 0) > 0;

    const baseReviews = useApiReviews
      ? (inquiries ?? []).map((item) => ({
          id: item.id,
          name: maskUserName(item.user_name),
          date: formatDateYYYYMMDD(item.created_at),
          category: item.category,
          review: stripHtml(item.content ?? ""),
        }))
      : HOME_USER_REVIEWS;

    if (activeFilter === "all") return baseReviews;
    return baseReviews.filter((review) => review.category === activeFilter);
  }, [activeFilter, inquiries, isLoading]);

  useEffect(() => {
    setActiveIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [activeFilter]);

  const updateActiveIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || filteredReviews.length === 0) return;

    const cardStep =
      track.firstElementChild?.getBoundingClientRect().width + CARD_GAP || 436;
    const index = Math.round(track.scrollLeft / cardStep);
    setActiveIndex(Math.min(Math.max(index, 0), filteredReviews.length - 1));
  }, [filteredReviews.length]);

  const scrollToIndex = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track || filteredReviews.length === 0) return;

      const nextIndex = Math.min(
        Math.max(index, 0),
        filteredReviews.length - 1
      );
      const card = track.children[nextIndex];
      if (card) {
        track.scrollTo({
          left: card.offsetLeft - track.offsetLeft,
          behavior: "smooth",
        });
      }
      setActiveIndex(nextIndex);
    },
    [filteredReviews.length]
  );

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < filteredReviews.length - 1;

  return (
    <section
      id="reviews"
      className="home-reviews"
      aria-labelledby="home-reviews-title"
    >
      <img
        className="home-reviews__bg"
        src={reviewsBg}
        alt=""
        aria-hidden
      />
      <div className="home-reviews__overlay" aria-hidden />

      <div className="home-reviews__inner">
        <div className="home-reviews__header">
          <header className="home-reviews__intro">
            <p className="home-reviews__label">{label}</p>
            <h2 id="home-reviews-title" className="home-reviews__title">
              {title}
            </h2>
            <p className="home-reviews__desc">{description}</p>
          </header>

          <div className="home-reviews__nav">
            <button
              type="button"
              className="home-reviews__nav-btn home-reviews__nav-btn--prev"
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="이전 후기"
            >
              <ReviewsChevronLeftIcon />
            </button>
            <span className="home-reviews__nav-divider" aria-hidden />
            <button
              type="button"
              className="home-reviews__nav-btn home-reviews__nav-btn--next"
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="다음 후기"
            >
              <ReviewsChevronRightIcon />
            </button>
            <button
              type="button"
              className="home-reviews__nav-btn home-reviews__nav-btn--plus"
              onClick={() => scrollToIndex(0)}
              aria-label="첫 후기로 이동"
            >
              <ReviewsPlusIcon />
            </button>
          </div>
        </div>

        <div
          className="home-reviews__filters"
          role="tablist"
          aria-label="후기 카테고리"
        >
          {HOME_USER_REVIEWS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.id}
              className={`home-reviews__filter${
                activeFilter === filter.id ? " home-reviews__filter--active" : ""
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="home-reviews__carousel">
          <div
            ref={trackRef}
            className="home-reviews__track"
            onScroll={updateActiveIndexFromScroll}
          >
            {filteredReviews.map((review, index) => (
              <HomeReviewCard
                key={review.id}
                review={review}
                featured={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
