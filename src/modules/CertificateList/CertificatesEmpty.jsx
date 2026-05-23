import { Link } from "react-router-dom";
import { MyPageEmptyIcon } from "../MyPageEmptyIcon";

export const CertificatesEmpty = () => (
  <div className="mypage-certificates__empty" role="status">
    <MyPageEmptyIcon />
    <p className="mypage-certificates__empty-title">보유한 수료증서가 없어요</p>
    <Link to="/courses" className="mypage-certificates__empty-cta">
      교육과정 보기
    </Link>
  </div>
);
