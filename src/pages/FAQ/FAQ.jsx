import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Link } from "../../components/Link";
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

          <div className="pagination-container">
            <div className="post-list">
              <div className="post-list-header">
                <div>No</div>
                <div>제목</div>
                <div>해시태그</div>
                <div>작성일자</div>
              </div>
              {isLoading ? (
                <div className="post-item">
                  <div></div>
                  <div>Loading...</div>
                </div>
              ) : columns && columns.length ? (
                columns.map((col) => (
                  <div key={col.id} className="post-item">
                    <div style={{ paddingRight: "10px" }}>{col.id}</div>
                    <Link
                      to={`/faq/${col.id}`}
                      className="post-item-link"
                      label={col.title}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "14px",
                        color: "#dee1e6",
                        width: "auto",
                        height: "fit-content",
                        textAlign: "left",
                        display: "block",
                        paddingRight: "10px",
                      }}
                    />
                    <div className="faq-hashtags" style={{ paddingRight: "10px" }}>
                      {col.hashtags || "-"}
                    </div>
                    <div style={{ paddingRight: "10px" }}>
                      {new Date(col.created_at).toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="post-item">
                  <div></div>
                  <div>등록된 칼럼이 없습니다.</div>
                </div>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
