import React from "react";
import PropTypes from "prop-types";
import { AppModal } from "./AppModal";
import "./AppModal.css";

/** 단일 확인 버튼 안내 모달 (v2 디자인) */
export const AppModalAlert = ({
  title,
  message,
  isOpen,
  onClose,
  confirmLabel = "확인",
}) => (
  <AppModal
    title={title}
    isOpen={isOpen}
    onClose={onClose}
    footerClassName="mypage-setting-modal__footer--single"
    footer={
      <button
        type="button"
        className="mypage-setting-modal__btn mypage-setting-modal__btn--confirm"
        onClick={onClose}
      >
        {confirmLabel}
      </button>
    }
  >
    <p className="app-modal-alert__message">{message}</p>
  </AppModal>
);

AppModalAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
};
