import React from "react";
import { Link } from "react-router-dom";
import {
  formatOrderAmount,
  formatOrderDateTime,
  getCancelDateTime,
  getCancelReason,
  getOrderDisplayStatus,
  getPaymentMethodLabel,
  isCanceledPayment,
} from "./orderListConfig";

export const OrderCard = ({ order }) => {
  const displayStatus = getOrderDisplayStatus(order);
  const isCanceled = isCanceledPayment(order);
  const detailHref = `/mypage/orders/${order.order_id}`;

  return (
    <article className="mypage-order-card">
      <div className="mypage-order-card__main">
        <span
          className={`mypage-order-card__badge${
            displayStatus === "canceled"
              ? " mypage-order-card__badge--canceled"
              : " mypage-order-card__badge--completed"
          }`}
        >
          {isCanceled ? "결제취소" : "결제완료"}
        </span>

        <h3 className="mypage-order-card__title">
          <Link to={detailHref}>{order.course_title}</Link>
        </h3>

        <p className="mypage-order-card__datetime">
          결제일시 {formatOrderDateTime(order.created_at)}
        </p>

        <p className="mypage-order-card__amount">
          {formatOrderAmount(order.amount)}
        </p>
      </div>

      <div className="mypage-order-card__detail">
        {isCanceled ? (
          <>
            <div className="mypage-order-card__detail-row">
              <span className="mypage-order-card__detail-label">환불 일시</span>
              <span className="mypage-order-card__detail-value">
                {getCancelDateTime(order)}
              </span>
            </div>
            <div className="mypage-order-card__detail-row">
              <span className="mypage-order-card__detail-label">취소 사유</span>
              <span className="mypage-order-card__detail-value">
                {getCancelReason(order)}
              </span>
            </div>
          </>
        ) : (
          <div className="mypage-order-card__detail-row">
            <span className="mypage-order-card__detail-label">결제 상세</span>
            <span className="mypage-order-card__detail-value">
              {getPaymentMethodLabel(order)}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};
