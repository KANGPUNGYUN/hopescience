import React from "react";
import { Button } from "../../../../components";
import { formatCartPrice, getCartDiscountAmount } from "./cartPageConfig";

const CartSummarySkeleton = () => (
  <dl className="cart-summary__rows">
    <div className="cart-summary__row">
      <dt>상품가격</dt>
      <dd>
        <span className="cart-skeleton cart-skeleton--text" />
      </dd>
    </div>
    <div className="cart-summary__row">
      <dt>할인</dt>
      <dd>
        <span className="cart-skeleton cart-skeleton--text" />
      </dd>
    </div>
    <div className="cart-summary__row cart-summary__row--total">
      <dt>총 결제금액</dt>
      <dd>
        <span className="cart-skeleton cart-skeleton--price" />
      </dd>
    </div>
  </dl>
);

export const CartSummaryAside = ({
  isLoading,
  course,
  onPay,
  payDisabled,
}) => {
  const discount = getCartDiscountAmount(course);

  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-heading">
      <h2 id="cart-summary-heading" className="cart-summary__title">
        최종 결제금액
      </h2>

      {isLoading ? (
        <CartSummarySkeleton />
      ) : (
        <dl className="cart-summary__rows">
          <div className="cart-summary__row">
            <dt>상품가격</dt>
            <dd>{formatCartPrice(course?.price)}</dd>
          </div>
          <div className="cart-summary__row cart-summary__row--discount">
            <dt>할인</dt>
            <dd>- {formatCartPrice(discount)}</dd>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <dt>총 결제금액</dt>
            <dd>{formatCartPrice(course?.discounted_price)}</dd>
          </div>
        </dl>
      )}

      <Button
        label="결제하기"
        variant="primary"
        size="full"
        className="cart-summary__pay-btn"
        onClick={onPay}
        disabled={isLoading || payDisabled}
      />
    </aside>
  );
};
