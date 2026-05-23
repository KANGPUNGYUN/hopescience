import React from "react";
import PropTypes from "prop-types";
import {
  PaginationChevronFirst,
  PaginationChevronLast,
  PaginationChevronNext,
  PaginationChevronPrev,
} from "./PaginationNavIcons";
import { getVisiblePageRange } from "./paginationNavUtils";
import "./PaginationNav.css";

/**
 * G7b6j 공통 페이지네이션 — 첫/이전/번호/다음/마지막
 */
export const PaginationNav = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  ariaLabel = "페이지 목록",
  showFirstLast = true,
  maxVisible = 5,
}) => {
  if (totalPages <= 1) return null;

  const pages = getVisiblePageRange(currentPage, totalPages, maxVisible);
  const rootClassName = ["pagination-nav", className].filter(Boolean).join(" ");

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav className={rootClassName} aria-label={ariaLabel}>
      {showFirstLast && (
        <button
          type="button"
          className="pagination-nav__btn"
          disabled={currentPage === 1}
          onClick={() => goTo(1)}
          aria-label="첫 페이지"
        >
          <PaginationChevronFirst />
        </button>
      )}
      <button
        type="button"
        className="pagination-nav__btn"
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <PaginationChevronPrev />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-nav__num${
            currentPage === page ? " pagination-nav__num--active" : ""
          }`}
          onClick={() => goTo(page)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="pagination-nav__btn"
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <PaginationChevronNext />
      </button>
      {showFirstLast && (
        <button
          type="button"
          className="pagination-nav__btn"
          disabled={currentPage === totalPages}
          onClick={() => goTo(totalPages)}
          aria-label="마지막 페이지"
        >
          <PaginationChevronLast />
        </button>
      )}
    </nav>
  );
};

PaginationNav.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  showFirstLast: PropTypes.bool,
  maxVisible: PropTypes.number,
};
