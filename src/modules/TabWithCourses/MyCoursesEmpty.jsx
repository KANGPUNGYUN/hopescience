import { Link } from "react-router-dom";
import { MyPageEmptyIcon } from "../MyPageEmptyIcon";

export const MyCoursesEmpty = () => (
  <div className="mypage-courses__empty-state" role="status">
    <MyPageEmptyIcon />
    <p className="mypage-courses__empty-title">보유한 강의가 없어요</p>
    <Link to="/courses" className="mypage-courses__empty-cta">
      교육과정 보기
    </Link>
  </div>
);
