import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { payment } from "../../store";
import { OrderDetailRow } from "./OrderDetailRow";
import {
  formatOrderAmount,
  formatOrderDateTime,
  formatPaymentNumber,
  getCancelDateTime,
  getCancelReason,
  getCourseTitle,
  getPaymentMethodLabel,
  getVatAmount,
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
  const amount = Number(paymentData.amount);

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

      <section className="mypage-order-detail__panel" aria-labelledby="order-detail-payment-info">
        <h3 id="order-detail-payment-info" className="mypage-order-detail__panel-title">
          결제 정보
        </h3>
        <div className="mypage-order-detail__panel-body">
          <OrderDetailRow label="결제금액" value={formatOrderAmount(amount)} />
          <OrderDetailRow label="부가세" value={`${getVatAmount(amount)}원`} />
          <OrderDetailRow label="할인액" value="0원" />
          <OrderDetailRow
            label="총 결제금액"
            value={formatOrderAmount(amount)}
            strong
          />
          <OrderDetailRow
            label="결제일"
            value={formatOrderDateTime(paymentData.created_at)}
          />
          <OrderDetailRow label="구매자" value={paymentData.user_name || "-"} />
          <OrderDetailRow
            label="결제번호"
            value={formatPaymentNumber(paymentData)}
          />
          <OrderDetailRow label="할부" value="일시불" />
        </div>
      </section>

      <section className="mypage-order-detail__panel" aria-labelledby="order-detail-payment-method">
        <h3 id="order-detail-payment-method" className="mypage-order-detail__panel-title">
          결제 방법
        </h3>
        <div className="mypage-order-detail__panel-body">
          <OrderDetailRow
            label="결제 수단"
            value={getPaymentMethodLabel(paymentData)}
          />
        </div>
      </section>

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
