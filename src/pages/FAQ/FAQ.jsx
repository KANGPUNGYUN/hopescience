import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import "./style.css";
import { column } from "../../store";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../icons/search.svg";
import leftArrowButton from "../../icons/chevron-left-large.svg";
import rightArrowButton from "../../icons/chevron-right-large.svg";

const POSTS_PER_PAGE = 6;

export const FAQ = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const { isLoading, columns, totalCount, getColumns } = column((state) => ({
    isLoading: state.isLoading,
    columns: state.columns,
    totalCount: state.totalCount,
    getColumns: state.getColumns,
  }));

  useEffect(() => {
    getColumns(0, POSTS_PER_PAGE, "desc");
  }, []);

  useEffect(() => {
    if (!searchKeyword) {
      getColumns(0, POSTS_PER_PAGE, "desc");
      setCurrentPage(1);
    }
  }, [searchKeyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    getColumns(0, POSTS_PER_PAGE, "desc");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const skip = (page - 1) * POSTS_PER_PAGE;
    getColumns(skip, POSTS_PER_PAGE, "desc");
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const renderPageButtons = () => {
    const pageButtons = [];
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);
    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={currentPage === i ? "pagination-page-button active" : "pagination-page-button"}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  const extractHashtags = (hashtags) => {
    if (!hashtags) return [];
    return hashtags
      .split(" ")
      .filter((tag) => tag.startsWith("#"))
      .slice(0, 5);
  };

  return (
    <>
      <Header />
      <main className="faq-background">
        <section className="faq-section">
          <div className="faq-header">
            <h3 className="faq-title">F&Q 칼럼</h3>
            <form className="faq-search-input-wrap" onSubmit={handleSearch}>
              <img src={searchIcon} className="search-icon" alt="검색" />
              <input
                type="search"
                className="faq-search-input"
                placeholder="Search..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </form>
          </div>

          <div className="faq-list">
            {isLoading ? (
              <p className="faq-empty">Loading...</p>
            ) : columns && columns.length ? (
              columns.map((col) => (
                <div
                  key={col.id}
                  className="faq-card"
                  onClick={() => navigate(`/faq/${col.id}`)}
                >
                  <h4 className="faq-card-title">{col.title}</h4>
                  <div className="faq-card-meta">
                    <span className="faq-card-date">
                      {new Date(col.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  {col.hashtags && (
                    <div className="faq-card-tags">
                      {extractHashtags(col.hashtags).map((tag, idx) => (
                        <span key={idx} className="faq-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="faq-empty">등록된 칼럼이 없습니다.</p>
            )}
          </div>

          <div className="pagination-buttons">
            <button
              className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <img className="img-11" alt="이전" src={leftArrowButton} />
            </button>
            <div className="pagination-button-wrap">{renderPageButtons()}</div>
            <button
              className={`pagination-button ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <img className="img-11" alt="다음" src={rightArrowButton} />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
