import React from "react";
import PropTypes from "prop-types";
import naverImage from "../../images/naver.png";

export const AuthSocialSection = ({ naverLoginRef, onNaverLogin }) => (
  <>
    <div className="auth-page__divider" aria-hidden>
      <span className="auth-page__divider-line" />
      <span className="auth-page__divider-label">또는</span>
      <span className="auth-page__divider-line" />
    </div>
    <div id="naverIdLogin" ref={naverLoginRef} />
    <button
      type="button"
      className="auth-page__naver"
      onClick={onNaverLogin}
    >
      <img
        className="auth-page__naver-icon"
        src={naverImage}
        alt=""
        aria-hidden
      />
      네이버 로그인
    </button>
  </>
);

AuthSocialSection.propTypes = {
  naverLoginRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  onNaverLogin: PropTypes.func.isRequired,
};
