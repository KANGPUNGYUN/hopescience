import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { inquiry } from "../../store";
import { PaginationNav } from "../../components/PaginationNav";
import { MyPageInquiryRow } from "./MyPageInquiryRow";
import { MyPageInquiriesEmpty } from "./MyPageInquiriesEmpty";
import {
  countInquiriesByTab,
  filterInquiriesByTab,
  INQUIRIES_PER_PAGE,
  INQUIRY_TABS,
} from "./myPageInquiryConfig";
import "./MyPageInquiryList.css";

export const MyPageInquiryList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState(null);

  const getMyInquiries = inquiry((state) => state.getMyInquiries);
  const deleteInquiry = inquiry((state) => state.deleteInquiry);
  const clearInquiries = inquiry((state) => state.clearInquiries);
  const inquiries = inquiry((state) => state.inquiries);
  const isLoading = inquiry((state) => state.isLoading);

  const loadInquiries = useCallback(async () => {
    await getMyInquiries();
  }, [getMyInquiries]);

  useEffect(() => {
    clearInquiries();
    loadInquiries();
  }, [clearInquiries, loadInquiries]);

  const myInquiries = useMemo(() => {
    return inquiries ?? [];
  }, [inquiries]);

  const filteredInquiries = useMemo(
    () => filterInquiriesByTab(myInquiries, activeTab),
    [myInquiries, activeTab]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInquiries.length / INQUIRIES_PER_PAGE)
  );

  const visibleInquiries = useMemo(() => {
    const start = (currentPage - 1) * INQUIRIES_PER_PAGE;
    return filteredInquiries.slice(start, start + INQUIRIES_PER_PAGE);
  }, [filteredInquiries, currentPage]);

  const hasAnyInquiry = myInquiries.length > 0;

  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setOpenId(null);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setOpenId(null);
  }, []);

  const handleToggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleDelete = useCallback(
    async (inquiryId) => {
      await deleteInquiry(inquiryId);
      if (openId === inquiryId) setOpenId(null);
      await loadInquiries();
    },
    [deleteInquiry, loadInquiries, openId]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (!hasAnyInquiry && !isLoading) {
    return <MyPageInquiriesEmpty />;
  }

  return (
    <div className="mypage-inquiries">
      <div className="mypage-inquiries__toolbar">
        <div
          className="mypage-inquiries__tabs"
          role="tablist"
          aria-label="문의 답변 상태"
        >
          {INQUIRY_TABS.map(({ key, label }) => {
            const count = countInquiriesByTab(myInquiries, key);
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                className={`mypage-inquiries__tab${
                  activeTab === key ? " mypage-inquiries__tab--active" : ""
                }`}
                onClick={() => handleTabChange(key)}
              >
                {label}
                {count > 0 ? ` ${count}` : ""}
              </button>
            );
          })}
        </div>
        <Link to="/mypage/inquiries/new" className="mypage-inquiries__write">
          1:1 문의하기
        </Link>
      </div>

      {isLoading ? (
        <p className="mypage-inquiries__loading">불러오는 중...</p>
      ) : filteredInquiries.length === 0 ? (
        <p className="mypage-inquiries__empty-tab">
          해당 조건의 문의 내역이 없습니다.
        </p>
      ) : (
        <>
          <ul className="mypage-inquiries__list">
            {visibleInquiries.map((item) => (
              <MyPageInquiryRow
                key={item.id}
                inquiry={item}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
                onDelete={handleDelete}
              />
            ))}
          </ul>

          {totalPages > 1 ? (
            <div className="mypage-inquiries__pagination">
              <PaginationNav
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
