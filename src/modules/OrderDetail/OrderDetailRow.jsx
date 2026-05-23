import React from "react";

export const OrderDetailRow = ({ label, value, strong = false }) => (
  <div className="mypage-order-detail__row">
    <span className="mypage-order-detail__row-label">{label}</span>
    <span
      className={`mypage-order-detail__row-value${
        strong ? " mypage-order-detail__row-value--strong" : ""
      }`}
    >
      {value}
    </span>
  </div>
);
