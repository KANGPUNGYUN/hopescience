import React from "react";

const CartUserSkeleton = () => (
  <dl className="cart-panel__rows">
    <div className="cart-panel__row">
      <dt>이름</dt>
      <dd>
        <span className="cart-skeleton cart-skeleton--title" />
      </dd>
    </div>
    <div className="cart-panel__row">
      <dt>연락처</dt>
      <dd>
        <span className="cart-skeleton cart-skeleton--text" />
      </dd>
    </div>
    <div className="cart-panel__row">
      <dt>이메일</dt>
      <dd>
        <span className="cart-skeleton cart-skeleton--text" />
      </dd>
    </div>
  </dl>
);

export const CartUserPanel = ({ isLoading, userData, onEdit }) => {
  return (
    <section className="cart-panel" aria-labelledby="cart-user-heading">
      <div className="cart-panel__title-row">
        <h2 id="cart-user-heading" className="cart-panel__title">
          주문자 정보
        </h2>
        <button
          type="button"
          className="cart-panel__edit-btn"
          onClick={onEdit}
          disabled={isLoading}
        >
          수정
        </button>
      </div>

      {isLoading ? (
        <CartUserSkeleton />
      ) : (
        <dl className="cart-panel__rows">
          <div className="cart-panel__row">
            <dt>이름</dt>
            <dd>{userData?.name || "-"}</dd>
          </div>
          <div className="cart-panel__row">
            <dt>연락처</dt>
            <dd>{userData?.phone || "-"}</dd>
          </div>
          <div className="cart-panel__row">
            <dt>이메일</dt>
            <dd>{userData?.email || "-"}</dd>
          </div>
        </dl>
      )}
    </section>
  );
};
