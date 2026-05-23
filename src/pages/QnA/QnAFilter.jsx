import React from "react";
import { QNA_BOARD_FILTERS } from "./qnaBoardConfig";

export const QnAFilter = ({ activeFilter, onFilterChange }) => (
  <div
    className="qna-board-toolbar__filters"
    role="tablist"
    aria-label="고객 후기 카테고리"
  >
    {QNA_BOARD_FILTERS.map((filter) => (
      <button
        key={filter.id}
        type="button"
        role="tab"
        aria-selected={activeFilter === filter.id}
        className={`qna-board-toolbar__filter${
          activeFilter === filter.id ? " qna-board-toolbar__filter--active" : ""
        }`}
        onClick={() => onFilterChange(filter.id)}
      >
        {filter.label}
      </button>
    ))}
  </div>
);
