import React from "react";
import { useHorizontalDragScroll } from "./useHorizontalDragScroll";

export const FaqFilter = ({ filters, activeFilter, onFilterChange }) => {
  const { scrollRef } = useHorizontalDragScroll();

  if (!filters?.length) return null;

  return (
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
  );
};
