import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../../components";
import { PaginationNav } from "../../components/PaginationNav";
import { inquiry } from "../../store";
import searchIcon from "../../icons/search.svg";
import { QnAHero } from "./QnAHero";
import { QnAFilter } from "./QnAFilter";
import { QnAListItem } from "./QnAListItem";
import {
  QNA_POSTS_PER_PAGE,
  matchesQnaFilter,
  reviewBoardRoutes,
} from "./qnaBoardConfig";
import { EducationReviewComingSoonModal } from "./EducationReviewComingSoonModal";
import { useEducationReviewComingSoon } from "./useEducationReviewComingSoon";
import "./style.css";

export const QnA = () => {
  const navigate = useNavigate();
  const { isApiEnabled, isComingSoonOpen, openComingSoon, closeComingSoon } =
    useEducationReviewComingSoon();
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const isLoading = inquiry((state) => state.isLoading);
  const getReviews = inquiry((state) => state.getReviews);
  const searchReviews = inquiry((state) => state.searchReviews);
  const inquiries = inquiry((state) => state.inquiries);
  const totalCount = inquiry((state) => state.totalCount);

  const myUserId = useMemo(() => {
    const data = localStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  const isClientPaged =
    Boolean(searchKeyword.trim()) || activeFilter !== "all";

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchKeyword]);

  useEffect(() => {
    if (!isApiEnabled) return;

    if (searchKeyword.trim()) {
      searchReviews(searchKeyword.trim());
      return;
    }

    const limit = isClientPaged ? 500 : QNA_POSTS_PER_PAGE;
    const skip = isClientPaged ? 0 : (currentPage - 1) * QNA_POSTS_PER_PAGE;
    getReviews(skip, limit, "desc");
  }, [
    isApiEnabled,
    searchKeyword,
    activeFilter,
    currentPage,
    isClientPaged,
    getReviews,
    searchReviews,
  ]);

  const filteredInquiries = useMemo(
    () =>
      (inquiries ?? []).filter((item) => matchesQnaFilter(item, activeFilter)),
    [inquiries, activeFilter]
  );

  const pagedInquiries = useMemo(() => {
    if (!isClientPaged) return filteredInquiries;
    const start = (currentPage - 1) * QNA_POSTS_PER_PAGE;
    return filteredInquiries.slice(start, start + QNA_POSTS_PER_PAGE);
  }, [filteredInquiries, isClientPaged, currentPage]);

  const totalPages = isClientPaged
    ? Math.ceil(filteredInquiries.length / QNA_POSTS_PER_PAGE) || 1
    : Math.ceil(totalCount / QNA_POSTS_PER_PAGE) || 1;

  const displayTotal = !isApiEnabled
    ? 0
    : isClientPaged
      ? filteredInquiries.length
      : totalCount;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document
      .querySelector(".qna-board-page__content")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWriteClick = () => {
    if (!isApiEnabled) {
      openComingSoon();
      return;
    }
    if (!myUserId) {
      navigate("/signin");
      return;
    }
    navigate(reviewBoardRoutes.new);
  };

  return (
    <>
      <div className="qna-board-page-shell">
        <Header variant="dark" />
        <main className="qna-board-page">
          <QnAHero />

          <section className="qna-board-page__content" aria-label="고객 후기 목록">
            <div className="qna-board-page__inner">
              <div className="qna-board-toolbar">
                <QnAFilter
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
                <div className="qna-board-toolbar__actions">
                  <form
                    className="qna-board-toolbar__search"
                    role="search"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <img src={searchIcon} alt="" className="qna-board-toolbar__search-icon" />
                    <input
                      type="search"
                      className="qna-board-toolbar__search-input"
                      placeholder="제목·후기 검색"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      aria-label="고객 후기 검색"
                      disabled={!isApiEnabled}
                    />
                  </form>
                  <button
                    type="button"
                    className="qna-board-toolbar__write"
                    onClick={handleWriteClick}
                  >
                    후기 작성
                  </button>
                </div>
              </div>

              <p className="qna-board-page__count">
                총 {displayTotal.toLocaleString()}건
              </p>

              <div className="qna-board-list">
                {!isApiEnabled ? (
                  <p className="qna-board-page__empty" role="status">
                    고객 후기 서비스를 준비하고 있습니다.
                  </p>
                ) : isLoading ? (
                  <p className="qna-board-page__status" role="status">
                    불러오는 중…
                  </p>
                ) : pagedInquiries.length > 0 ? (
                  pagedInquiries.map((item) => (
                    <QnAListItem key={item.id} inquiry={item} />
                  ))
                ) : (
                  <p className="qna-board-page__empty" role="status">
                    {searchKeyword.trim()
                      ? "검색 결과가 없습니다."
                      : "등록된 고객 후기가 없습니다."}
                  </p>
                )}
              </div>

              {isApiEnabled && !isLoading && pagedInquiries.length > 0 && (
                <PaginationNav
                  className="qna-board-page__pagination"
                  ariaLabel="고객 후기 페이지"
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

      <EducationReviewComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={closeComingSoon}
      />
    </>
  );
};
