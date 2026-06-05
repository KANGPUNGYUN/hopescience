import React from "react";
import {
  PaginationChevronPrev,
  PaginationChevronNext,
} from "../../components/PaginationNav/PaginationNavIcons";
import { useHorizontalDragScroll } from "./useHorizontalDragScroll";

export const FaqFilter = ({ filters, activeFilter, onFilterChange }) => {
  const { scrollRef, canScrollLeft, canScrollRight, scrollByDirection } =
    useHorizontalDragScroll();

  if (!filters?.length) return null;

  return (
    <div className="faq-page__filters-bar">
      <button
        type="button"
        className="faq-page__filters-nav faq-page__filters-nav--prev"
        onClick={() => scrollByDirection(-1)}
        disabled={!canScrollLeft}
        aria-label="이전 태그 보기"
      >
        <PaginationChevronPrev />
      </button>

      <div className="faq-page__filters-scroll">
        <div
          ref={scrollRef}
          className="faq-page__filters"
          role="tablist"
          aria-label="FAQ 해시태그"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.id}
              className={`faq-page__filter${
                activeFilter === filter.id ? " faq-page__filter--active" : ""
              }`}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="faq-page__filters-nav faq-page__filters-nav--next"
        onClick={() => scrollByDirection(1)}
        disabled={!canScrollRight}
        aria-label="다음 태그 보기"
      >
        <PaginationChevronNext />
      </button>
    </div>
  );
};
