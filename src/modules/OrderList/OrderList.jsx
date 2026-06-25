import React, { useCallback, useEffect, useMemo, useState } from "react";
import { payment } from "../../store";
import { PaginationNav } from "../../components/PaginationNav";
import { OrderCard } from "./OrderCard";
import { OrdersEmpty } from "./OrdersEmpty";
import {
  filterOrdersByTab,
  ORDER_TABS,
  ORDERS_PER_PAGE,
} from "./orderListConfig";
import "./OrderList.css";

export const OrderList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const getPaymentByUser = payment((state) => state.getPaymentByUser);
  const clearPayments = payment((state) => state.clearPayments);
  const payments = payment((state) => state.payments);
  const isLoading = payment((state) => state.isLoading);

  const myUserId = useMemo(() => {
    const data = localStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  useEffect(() => {
    if (!myUserId) return;
    clearPayments();
    getPaymentByUser(myUserId);
  }, [myUserId, clearPayments, getPaymentByUser]);

  const filteredOrders = useMemo(
    () => filterOrdersByTab(payments ?? [], activeTab),
    [payments, activeTab]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
  );

  const visibleOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const hasAnyOrder = (payments?.length ?? 0) > 0;

  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="mypage-orders">
      {hasAnyOrder && (
        <>
          <div
            className="mypage-orders__tabs"
            role="tablist"
            aria-label="결제 내역 필터"
          >
            {ORDER_TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                className={`mypage-orders__tab${
                  activeTab === key ? " mypage-orders__tab--active" : ""
                }`}
                onClick={() => handleTabChange(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="mypage-orders__loading">불러오는 중...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="mypage-orders__empty-tab">
              해당 조건의 결제 내역이 없습니다.
            </p>
          ) : (
            <ul className="mypage-orders__list">
              {visibleOrders.map((order) => (
                <li key={order.order_id ?? order.id}>
                  <OrderCard order={order} />
                </li>
              ))}
            </ul>
          )}

          {!isLoading && filteredOrders.length > 0 && (
            <PaginationNav
              className="mypage-orders__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              ariaLabel="결제 내역 페이지"
            />
          )}
        </>
      )}

      {!isLoading && !hasAnyOrder && <OrdersEmpty />}
      {isLoading && !hasAnyOrder && (
        <p className="mypage-orders__loading">불러오는 중...</p>
      )}
    </div>
  );
};
