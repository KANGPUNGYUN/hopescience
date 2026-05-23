import React from "react";
import { COURSES_FILTERS } from "./coursesConfig";

export const CoursesFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div
      className="courses-filter"
      role="tablist"
      aria-label="교육 과정 카테고리"
    >
      {COURSES_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`courses-filter__pill${
              isActive ? " courses-filter__pill--active" : ""
            }`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
