import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { AppModalAlert } from "../../modules/AppModal";
import "./Footer.css";
import {
  POLICY_LINKS,
  COMPANY_INFO,
  SOCIAL_LINKS,
  SOCIAL_UNAVAILABLE_MODAL,
} from "./footerConfig";
import { InstagramIcon, YoutubeIcon } from "./FooterIcons";
import logoBlack from "../../images/v2/logo-black.png";
import logoWhite from "../../images/v2/logo.png";

const MOBILE_INFO_LINES = [
  `대표자: ${COMPANY_INFO.representative}`,
  `사업자 주소: ${COMPANY_INFO.address}`,
  `통신판매번호: ${COMPANY_INFO.salesNumber}`,
  `사업자 번호: ${COMPANY_INFO.businessNumber}`,
  `이메일 주소: ${COMPANY_INFO.email}`,
  `대표 연락처: ${COMPANY_INFO.phone}`,
];

/**
 * @param {'light' | 'dark'} variant
 * - light: nFgXY / YQobR — 밝은 배경, 다크 텍스트
 * - dark: JGZ4p / cCyMG — #090c12 배경, 라이트 텍스트
 */
export const Footer = ({ variant = "light" }) => {
  const logoSrc = variant === "dark" ? logoWhite : logoBlack;
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  const renderSocialLink = (href, label, Icon, size) => {
    const icon = <Icon size={size} />;

    if (href) {
      return (
        <a
          href={href}
          className="site-footer__social-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          {icon}
        </a>
      );
    }

    return (
      <button
        type="button"
        className="site-footer__social-link"
        aria-label={`${label} (준비 중)`}
        onClick={() => setIsSocialModalOpen(true)}
      >
        {icon}
      </button>
    );
  };

  return (
    <>
    <footer className={`site-footer site-footer--${variant}`}>
      <div className="site-footer__inner">
        <div className="site-footer__main">
          <RouterLink
            to="/"
            className="site-footer__logo"
            aria-label="희망과학 심리상담센터 홈"
          >
            <img
              src={logoSrc}
              alt=""
              className="site-footer__logo-img site-footer__logo-img--desktop"
              width={46}
              height={46}
            />
            <img
              src={logoSrc}
              alt=""
              className="site-footer__logo-img site-footer__logo-img--mobile"
              width={36}
              height={36}
            />
            <span className="site-footer__logo-text">희망과학 심리상담센터</span>
          </RouterLink>

          <div className="site-footer__content">
            <nav className="site-footer__policies" aria-label="약관 및 정책">
              {POLICY_LINKS.map((item, index) => (
                <React.Fragment key={item.hash}>
                  {index > 0 && (
                    <span className="site-footer__policy-divider" aria-hidden />
                  )}
                  <HashLink
                    to={`/policy#${item.hash}`}
                    className={`site-footer__policy-link${
                      item.hash === "privacy"
                        ? " site-footer__policy-link--emphasis"
                        : ""
                    }`}
                  >
                    {item.label}
                  </HashLink>
                </React.Fragment>
              ))}
            </nav>

            <div className="site-footer__info site-footer__info--desktop">
              <p>
                대표자: {COMPANY_INFO.representative}
                <span className="site-footer__sep" aria-hidden>
                  |
                </span>
                사업자 주소: {COMPANY_INFO.address}
                <span className="site-footer__sep" aria-hidden>
                  |
                </span>
                통신판매번호: {COMPANY_INFO.salesNumber}
              </p>
              <p>
                사업자 번호: {COMPANY_INFO.businessNumber}
                <span className="site-footer__sep" aria-hidden>
                  |
                </span>
                이메일 주소: {COMPANY_INFO.email}
                <span className="site-footer__sep" aria-hidden>
                  |
                </span>
                대표 연락처: {COMPANY_INFO.phone}
              </p>
            </div>

            <div className="site-footer__info site-footer__info--mobile">
              {MOBILE_INFO_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <p className="site-footer__copyright">{COMPANY_INFO.copyright}</p>
          </div>

          <div className="site-footer__social" aria-label="소셜 미디어">
            {renderSocialLink(
              SOCIAL_LINKS.instagram,
              "Instagram",
              InstagramIcon,
              25
            )}
            {renderSocialLink(
              SOCIAL_LINKS.youtube,
              "YouTube",
              YoutubeIcon,
              27
            )}
          </div>
        </div>
      </div>

    </footer>

    <AppModalAlert
      title={SOCIAL_UNAVAILABLE_MODAL.title}
      message={SOCIAL_UNAVAILABLE_MODAL.message}
      isOpen={isSocialModalOpen}
      onClose={() => setIsSocialModalOpen(false)}
    />
    </>
  );
};

Footer.propTypes = {
  variant: PropTypes.oneOf(["light", "dark"]),
};
