import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { MOBILE_DRAWER_ITEMS, NAV_ITEMS } from "./headerConfig";
import { DrawerNavIcon } from "./HeaderDrawerIcons";

const CloseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
    <path
      d="M8 8L24 24M24 8L8 24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const HeaderMobileDrawer = ({
  open,
  user,
  onClose,
  onLogout,
}) => {
  const navigate = useNavigate();

  const renderPrimaryNavItem = (item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className="site-header__drawer-link"
        end={item.to === "/"}
        onClick={onClose}
      >
        <span className="site-header__drawer-link-label">{item.label}</span>
      </NavLink>
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="site-header__drawer-root" role="presentation">
      <div
        className="site-header__drawer-overlay"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="site-header__drawer"
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
      >
        <div className="site-header__drawer-top">
          <button
            type="button"
            className="site-header__drawer-close"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <CloseIcon />
          </button>
        </div>

        {user ? (
          <>
            <p className="site-header__drawer-email">{user.email || user.name}</p>
            <NavLink
              to="/mypage/setting"
              className="site-header__drawer-account-btn"
              onClick={onClose}
            >
              계정 설정
            </NavLink>
            <nav className="site-header__drawer-nav" aria-label="주요 메뉴">
              {NAV_ITEMS.map(renderPrimaryNavItem)}
            </nav>
            <nav
              className="site-header__drawer-nav site-header__drawer-nav--account"
              aria-label="마이페이지 메뉴"
            >
              {MOBILE_DRAWER_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="site-header__drawer-link"
                  onClick={onClose}
                >
                  <DrawerNavIcon name={item.icon} />
                  <span className="site-header__drawer-link-label">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              className="site-header__drawer-logout"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <nav
            className="site-header__drawer-nav site-header__drawer-nav--guest"
            aria-label="주요 메뉴"
          >
            {NAV_ITEMS.map(renderPrimaryNavItem)}
            <div className="site-header__drawer-auth">
              <button
                type="button"
                className="site-header__drawer-login"
                onClick={() => {
                  navigate("/signin");
                  onClose();
                }}
              >
                로그인
              </button>
              <button
                type="button"
                className="site-header__drawer-signup"
                onClick={() => {
                  navigate("/signup");
                  onClose();
                }}
              >
                회원가입
              </button>
            </div>
          </nav>
        )}
      </aside>
    </div>,
    document.body
  );
};
