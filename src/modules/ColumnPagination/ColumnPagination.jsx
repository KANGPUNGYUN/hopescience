import React, { useState, useEffect } from "react";
import "./ColumnPagination.css";
import { Link } from "../../components/Link";
import { Button } from "../../components/Button";
import { column, auth } from "../../store";
import { Modal } from "../Modal";
import { useNavigate } from "react-router-dom";
import leftArrowButton from "../../icons/chevron-left-large.svg";
import rightArrowButton from "../../icons/chevron-right-large.svg";

const POSTS_PER_PAGE = 7;

export const ColumnPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const navigate = useNavigate();

  const { isLoading, columns, totalCount, getColumns, deleteColumn } = column(
    (state) => ({
      isLoading: state.isLoading,
      columns: state.columns,
      totalCount: state.totalCount,
      getColumns: state.getColumns,
      deleteColumn: state.deleteColumn,
    })
  );

  useEffect(() => {
    getColumns(0, POSTS_PER_PAGE, "desc");
  }, []);

  const handlePageChange = (page) => {
    const skip = (page - 1) * POSTS_PER_PAGE;
    getColumns(skip, POSTS_PER_PAGE, "desc");
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleDeleteClick = (id) => {
    setTargetId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    const { accessToken } = auth.getState();
    await deleteColumn(targetId, accessToken);
    setShowModal(false);
    setTargetId(null);
    const skip = (currentPage - 1) * POSTS_PER_PAGE;
    getColumns(skip, POSTS_PER_PAGE, "desc");
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
          className={currentPage === i ? "column-pagination-page-button active" : "column-pagination-page-button"}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  return (
    <div className="column-pagination-container">
      <div className="column-pagination-container-header">
        <Link
          to="/admin/column/new"
          label="칼럼 작성"
          buttonStyle="default"
          color="white"
          style={{
            fontSize: "14px",
            padding: "7px 20px",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 12H20M12 4V20"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
      <div className="column-list">
        <div className="column-list-header">
          <div>No</div>
          <div>제목</div>
          <div>작성일자</div>
          <div>관리</div>
        </div>
        {isLoading ? (
          <div className="column-list-item">
            <div></div>
            <div>Loading...</div>
          </div>
        ) : columns && columns.length ? (
          columns.map((col) => (
            <div key={col.id} className="column-list-item">
              <div>{col.id}</div>
              <div className="column-list-title">{col.title}</div>
              <div>{new Date(col.created_at).toLocaleDateString("ko-KR")}</div>
              <div className="column-list-actions">
                <Button
                  label="수정"
                  onClick={() => navigate(`/admin/column/${col.id}`)}
                  style={{ width: "60px", height: "30px", fontSize: "13px" }}
                />
                <Button
                  label="삭제"
                  variant="danger"
                  onClick={() => handleDeleteClick(col.id)}
                  style={{ width: "60px", height: "30px", fontSize: "13px" }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="column-list-item">
            <div></div>
            <div>등록된 칼럼이 없습니다.</div>
          </div>
        )}
      </div>
      <div className="column-pagination-footer">
        <div className="column-pagination-count">
          {totalCount || 0} results
        </div>
        <div className="column-pagination-buttons">
          <button
            className={`column-pagination-button ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <img className="img-11" alt="이전" src={leftArrowButton} />
          </button>
          <div className="column-pagination-button-wrap">{renderPageButtons()}</div>
          <button
            className={`column-pagination-button ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <img className="img-11" alt="다음" src={rightArrowButton} />
          </button>
        </div>
      </div>
      <Modal
        modalTitle="칼럼 삭제"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        confirmLabel="삭제"
      >
        <p>정말 이 칼럼을 삭제하시겠습니까?</p>
      </Modal>
    </div>
  );
};
