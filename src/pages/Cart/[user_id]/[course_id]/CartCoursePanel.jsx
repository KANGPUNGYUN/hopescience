import React from "react";
import mainImage from "../../../../images/main.png";
import { formatCartPrice } from "./cartPageConfig";

const CartCourseSkeleton = () => (
  <>
    <div className="cart-panel__media cart-panel__media--skeleton" aria-hidden="true" />
    <dl className="cart-panel__rows">
      <div className="cart-panel__row">
        <dt>주문번호</dt>
        <dd>
          <span className="cart-skeleton cart-skeleton--text" />
        </dd>
      </div>
      <div className="cart-panel__row">
        <dt>상품명</dt>
        <dd>
          <span className="cart-skeleton cart-skeleton--title" />
        </dd>
      </div>
      <div className="cart-panel__row">
        <dt>상품 금액</dt>
        <dd>
          <span className="cart-skeleton cart-skeleton--price" />
        </dd>
      </div>
    </dl>
  </>
);

export const CartCoursePanel = ({ isLoading, course, orderNumber }) => {
  return (
    <section className="cart-panel" aria-labelledby="cart-course-heading">
      <h2 id="cart-course-heading" className="cart-panel__title">
        주문상품 정보
      </h2>

      <div className="cart-panel__course">
        {isLoading ? (
          <CartCourseSkeleton />
        ) : (
          <>
            <div className="cart-panel__media">
              <img
                src={course?.thumbnail || mainImage}
                alt=""
                className="cart-panel__image"
              />
            </div>
            <dl className="cart-panel__rows">
              <div className="cart-panel__row">
                <dt>주문번호</dt>
                <dd className="cart-panel__value--mono">{orderNumber}</dd>
              </div>
              <div className="cart-panel__row">
                <dt>상품명</dt>
                <dd>{course?.title}</dd>
              </div>
              <div className="cart-panel__row">
                <dt>상품 금액</dt>
                <dd className="cart-panel__value--strong">
                  {formatCartPrice(course?.discounted_price)}
                </dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </section>
  );
};
