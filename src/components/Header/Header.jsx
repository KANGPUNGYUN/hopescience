import React, { useEffect, useState } from "react";
import { Link as RouterLink, NavLink, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Header.css";
import { auth } from "../../store";
import { NAV_ITEMS } from "./headerConfig";
import { HeaderMobileDrawer } from "./HeaderMobileDrawer";
import logoMark from "../../images/v2/logo-black.png";

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 7H20M4 12H20M4 17H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
    <path
      d="M7 7L21 21M21 7L7 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 10.5L12 4L20 10.5V19C20 19.5523 19.5523 20 19 20H15V14H9V20H5C4.44772 20 4 19.5523 4 19V10.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * @param {'light' | 'dark' | 'solid'} variant
 * - light: L115bh — 반투명 밝은 헤더, 다크 텍스트 (기본 내부 페이지)
 * - dark: WMhbt — 투명/다크 오버레이, 화이트 텍스트 (히어로 위)
 * - solid: g0xI8 — 불투명 밝은 배경, 마이페이지 영역
 */
export const Header = ({
  variant = "light",
  mobileTitle,
  onMobileClose,
  mobileBackVariant = "close",
  mobileActionLabel,
  mobileActionFormId,
}) => {
  const { user, logout } = auth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isSubpageMobile = Boolean(mobileTitle);
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const headerClassName = [
    "site-header",
    `site-header--${variant}`,
    isLoggedIn && "site-header--authenticated",
    isSubpageMobile && "site-header--subpage",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      {/* Desktop */}
      <div className="site-header__desktop">
        <RouterLink to="/" className="site-header__logo" aria-label="희망과학 심리상담센터 홈">
          <img
            src={logoMark}
            alt=""
            className="site-header__logo-mark site-header__logo-mark--desktop"
            width={46}
            height={46}
          />
          <span className="site-header__logo-text">희망과학 심리상담센터</span>
        </RouterLink>

        <nav className="site-header__nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `site-header__nav-link${isActive ? " site-header__nav-link--active" : ""}`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          {isLoggedIn ? (
            <RouterLink to="/mypage/courses" className="site-header__mypage-btn">
              마이페이지
            </RouterLink>
          ) : (
            <>
              <RouterLink to="/signup" className="site-header__signup-link">
                회원가입
              </RouterLink>
              <RouterLink to="/signin" className="site-header__login-btn">
                로그인
              </RouterLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="site-header__mobile">
        {isSubpageMobile ? (
          <>
            {mobileBackVariant === "home" ? (
              <button
                type="button"
                className="site-header__mobile-back"
                onClick={onMobileClose}
                aria-label="뒤로"
              >
                <HomeIcon />
              </button>
            ) : (
              <div className="site-header__mobile-spacer" aria-hidden />
            )}
            <h1 className="site-header__mobile-title">{mobileTitle}</h1>
            {mobileActionLabel ? (
              <button
                type="submit"
                form={mobileActionFormId}
                className="site-header__mobile-action"
              >
                {mobileActionLabel}
              </button>
            ) : (
              <button
                type="button"
                className="site-header__mobile-close"
                onClick={onMobileClose}
                aria-label="닫기"
              >
                <CloseIcon />
              </button>
            )}
          </>
        ) : (
          <>
            <RouterLink to="/" className="site-header__logo site-header__logo--mobile" aria-label="홈">
              <img
                src={logoMark}
                alt=""
                className="site-header__logo-mark site-header__logo-mark--mobile"
                width={36}
                height={36}
              />
              <span className="site-header__logo-text site-header__logo-text--mobile">
                희망과학 심리상담센터
              </span>
            </RouterLink>
            <button
              type="button"
              className="site-header__menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="메뉴 열기"
              aria-expanded={drawerOpen}
            >
              <MenuIcon />
            </button>
          </>
        )}
      </div>

      <HeaderMobileDrawer
        open={drawerOpen}
        user={user}
        onClose={() => setDrawerOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
};

Header.propTypes = {
  variant: PropTypes.oneOf(["light", "dark", "solid"]),
  mobileTitle: PropTypes.string,
  onMobileClose: PropTypes.func,
  mobileBackVariant: PropTypes.oneOf(["close", "home"]),
  mobileActionLabel: PropTypes.string,
  mobileActionFormId: PropTypes.string,
};
