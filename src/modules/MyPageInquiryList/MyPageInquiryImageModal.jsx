import React, { useEffect } from "react";

export const MyPageInquiryImageModal = ({ src, alt = "", onClose }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="mypage-inquiry-image-modal"
      role="dialog"
      aria-modal="true"
      aria-label="이미지 확대 보기"
      onClick={onClose}
    >
      <button
        type="button"
        className="mypage-inquiry-image-modal__close"
        aria-label="닫기"
        onClick={onClose}
      >
        ×
      </button>
      <img
        src={src}
        alt={alt}
        className="mypage-inquiry-image-modal__img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
