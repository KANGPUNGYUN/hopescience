import React, { useId } from "react";
import "./AppModal.css";

export const AppModal = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  footerClassName = "",
  headerVariant = "default",
}) => {
  const titleId = useId();

  if (!isOpen) return null;

  return (
    <div
      className="mypage-setting-modal__overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="mypage-setting-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mypage-setting-modal__header${
            headerVariant === "withdraw"
              ? " mypage-setting-modal__header--withdraw"
              : ""
          }`}
        >
          <h3 id={titleId} className="mypage-setting-modal__title">
            {title}
          </h3>
          <button
            type="button"
            className="mypage-setting-modal__close"
            onClick={onClose}
            aria-label="닫기"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
              <path
                d="M8.167 8.167L19.833 19.833M19.833 8.167L8.167 19.833"
                stroke="#222"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="mypage-setting-modal__body">{children}</div>
        {footer ? (
          <div
            className={`mypage-setting-modal__footer${
              footerClassName ? ` ${footerClassName}` : ""
            }`}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const AppModalFooter = ({
  cancelLabel = "취소",
  confirmLabel,
  onCancel,
  onConfirm,
  confirmDisabled = false,
  isSubmitting = false,
  confirmVariant = "primary",
}) => (
  <>
    <button
      type="button"
      className="mypage-setting-modal__btn mypage-setting-modal__btn--cancel"
      onClick={onCancel}
    >
      {cancelLabel}
    </button>
    <button
      type="button"
      className={`mypage-setting-modal__btn mypage-setting-modal__btn--confirm${
        confirmVariant === "danger"
          ? " mypage-setting-modal__btn--confirm-danger"
          : ""
      }`}
      onClick={onConfirm}
      disabled={confirmDisabled || isSubmitting}
    >
      {isSubmitting ? "처리 중..." : confirmLabel}
    </button>
  </>
);
