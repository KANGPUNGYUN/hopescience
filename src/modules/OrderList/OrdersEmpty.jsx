import { Link } from "react-router-dom";
import { MyPageEmptyIcon } from "../MyPageEmptyIcon";

export const OrdersEmpty = () => (
  <div className="mypage-orders__empty" role="status">
    <MyPageEmptyIcon />
    <p className="mypage-orders__empty-title">구매 내역이 없어요</p>
    <Link to="/courses" className="mypage-orders__empty-cta">
      교육과정 보기
    </Link>
  </div>
);
