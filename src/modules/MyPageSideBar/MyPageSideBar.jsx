import "./MyPageSideBar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { auth } from "../../store";
import {
  SidebarCoursesIcon,
  SidebarCertificateIcon,
  SidebarReceiptIcon,
  SidebarInquiryIcon,
  SidebarLogoutIcon,
} from "./MyPageSideBarIcons";

const NAV_ITEMS = [
  {
    to: "/mypage/courses",
    label: "교육 진행 현황",
    Icon: SidebarCoursesIcon,
  },
  {
    to: "/mypage/certificates",
    label: "수료 증서",
    Icon: SidebarCertificateIcon,
  },
  {
    to: "/mypage/orders",
    label: "결제 내역",
    Icon: SidebarReceiptIcon,
  },
  {
    to: "/mypage/inquiries",
    label: "1:1 문의",
    Icon: SidebarInquiryIcon,
  },
];

export const MyPageSideBar = () => {
  const logout = auth((state) => state.logout);
  const navigate = useNavigate();

  const userEmail = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    if (!data) return "";
    try {
      const parsed = JSON.parse(data);
      return parsed.state?.user?.email || "";
    } catch {
      return "";
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="mypage-sidebar">
      <h2 className="mypage-sidebar__title">마이페이지</h2>
      {userEmail ? (
        <p className="mypage-sidebar__email">{userEmail}</p>
      ) : null}
      <Link to="/mypage/setting" className="mypage-sidebar__settings-btn">
        계정 설정
      </Link>
      <nav className="mypage-sidebar__nav" aria-label="마이페이지 메뉴">
        <ul className="mypage-sidebar__list">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <li key={to} className="mypage-sidebar__item">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `mypage-sidebar__link${isActive ? " mypage-sidebar__link--active" : ""}`
                }
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mypage-sidebar__footer">
        <button
          type="button"
          className="mypage-sidebar__logout-btn"
          onClick={handleLogout}
        >
          <SidebarLogoutIcon />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
};
