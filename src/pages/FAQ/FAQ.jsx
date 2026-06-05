import React, { useEffect, useMemo, useState } from "react";
import { Header, Footer } from "../../components";
import { PaginationNav } from "../../components/PaginationNav";
import { column } from "../../store";
import searchIcon from "../../icons/search.svg";
import { FaqHero } from "./FaqHero";
import { FaqFilter } from "./FaqFilter";
import { FaqListItem } from "./FaqListItem";
import {
  FAQ_FETCH_LIMIT,
  FAQ_FETCH_SKIP,
  FAQ_FETCH_SORT,
  FAQ_POSTS_PER_PAGE,
} from "./faqPageConfig";
import {
  buildFaqHashtagFilters,
  mapColumnToFaqItem,
  matchesFaqHashtagFilter,
  matchesFaqSearch,
} from "./faqPageUtils";
import "./style.css";

export const FAQ = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { columns, isLoading, getColumns } = column((state) => ({
    columns: state.columns,
    isLoading: state.isLoading,
    getColumns: state.getColumns,
  }));

  useEffect(() => {
    getColumns(FAQ_FETCH_SKIP, FAQ_FETCH_LIMIT, FAQ_FETCH_SORT);
  }, [getColumns]);

  const faqItems = useMemo(
    () => (columns ?? []).map(mapColumnToFaqItem),
    [columns]
  );

  const hashtagFilters = useMemo(
    () => buildFaqHashtagFilters(faqItems),
    [faqItems]
  );

  const filteredItems = useMemo(
    () =>
      faqItems
        .filter((item) => matchesFaqHashtagFilter(item, activeFilter))
        .filter((item) => matchesFaqSearch(item, searchKeyword)),
    [faqItems, activeFilter, searchKeyword]
  );

  const totalPages = Math.ceil(filteredItems.length / FAQ_POSTS_PER_PAGE) || 1;

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * FAQ_POSTS_PER_PAGE;
    return filteredItems.slice(start, start + FAQ_POSTS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchKeyword]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const filterIds = hashtagFilters.map((filter) => filter.id);
    if (!filterIds.includes(activeFilter)) {
      setActiveFilter("all");
    }
  }, [hashtagFilters, activeFilter]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document
      .querySelector(".faq-board-page__content")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="faq-board-page-shell">
        <Header variant="dark" />

        <main className="faq-board-page">
          <FaqHero />

          <section
            className="faq-board-page__content"
            aria-label="자주 묻는 질문 목록"
          >
            <div className="faq-board-page__inner">
              <div className="faq-board-toolbar">
                <form
                  className="faq-board-toolbar__search"
                  role="search"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <img
                    src={searchIcon}
                    alt=""
                    className="faq-board-toolbar__search-icon"
                  />
                  <input
                    type="search"
                    className="faq-board-toolbar__search-input"
                    placeholder="질문·내용 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    aria-label="자주 묻는 질문 검색"
                  />
                </form>
                <FaqFilter
                  filters={hashtagFilters}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </div>

              <p className="faq-board-page__count">
                총 {filteredItems.length.toLocaleString()}건
              </p>

              <div className="faq-board-list">
                {isLoading ? (
                  <p className="faq-board-page__status" role="status">
                    질문 목록을 불러오는 중입니다.
                  </p>
                ) : pagedItems.length > 0 ? (
                  pagedItems.map((item) => (
                    <FaqListItem key={item.id} item={item} />
                  ))
                ) : (
                  <p className="faq-board-page__empty" role="status">
                    {searchKeyword.trim() || activeFilter !== "all"
                      ? "조건에 해당하는 질문이 없습니다."
                      : "등록된 질문이 없습니다."}
                  </p>
                )}
              </div>

              {!isLoading && pagedItems.length > 0 && (
                <PaginationNav
                  className="faq-board-page__pagination"
                  ariaLabel="자주 묻는 질문 페이지"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};
