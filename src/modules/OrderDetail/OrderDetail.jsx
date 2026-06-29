import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { payment } from "../../store";
import { OrderDetailRow } from "./OrderDetailRow";
import {
  formatOrderAmount,
  formatOrderDateTime,
  getCancelDateTime,
  getCancelReason,
  getCourseTitle,
  isCanceledPayment,
} from "./orderDetailConfig";
import "./OrderDetail.css";

export const OrderDetail = () => {
  const { payment_id: orderId } = useParams();
  const getPaymentByOrderId = payment((state) => state.getPaymentByOrderId);
  const paymentData = payment((state) => state.payment);
  const isLoading = payment((state) => state.isLoading);

  useEffect(() => {
    if (!orderId) return;
    getPaymentByOrderId(orderId);
  }, [getPaymentByOrderId, orderId]);

  if (isLoading) {
    return <p className="mypage-order-detail__loading">결제 정보를 불러오는 중입니다.</p>;
  }

  if (!paymentData) {
    return (
      <div className="mypage-order-detail__empty">
        <p>결제 정보를 찾을 수 없습니다.</p>
        <Link to="/mypage/orders" className="mypage-order-detail__back-cta">
          결제 내역으로 돌아가기
        </Link>
      </div>
    );
  }

  const canceled = isCanceledPayment(paymentData);

  return (
    <div className="mypage-order-detail">
      <Link to="/mypage/orders" className="mypage-order-detail__back">
        결제 내역
      </Link>

      <article className="mypage-order-detail__summary">
        <div className="mypage-order-detail__summary-head">
          <span
            className={`mypage-order-detail__badge${
              canceled
                ? " mypage-order-detail__badge--canceled"
                : " mypage-order-detail__badge--completed"
            }`}
          >
            {canceled ? "결제취소" : "결제완료"}
          </span>
          <p className="mypage-order-detail__summary-amount">
            {formatOrderAmount(paymentData.amount)}
          </p>
        </div>

        <h2 className="mypage-order-detail__course-title">
          {getCourseTitle(paymentData)}
        </h2>

        <p className="mypage-order-detail__summary-datetime">
          결제일시 {formatOrderDateTime(paymentData.created_at)}
        </p>
      </article>

      {canceled ? (
        <section className="mypage-order-detail__panel" aria-labelledby="order-detail-cancel-info">
          <h3 id="order-detail-cancel-info" className="mypage-order-detail__panel-title">
            취소·환불 정보
          </h3>
          <div className="mypage-order-detail__panel-body">
            <OrderDetailRow
              label="환불 일시"
              value={getCancelDateTime(paymentData)}
            />
            <OrderDetailRow
              label="취소 사유"
              value={getCancelReason(paymentData)}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
};
