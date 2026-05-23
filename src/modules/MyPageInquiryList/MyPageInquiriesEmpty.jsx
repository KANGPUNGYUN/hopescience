import React from "react";
import { Link } from "react-router-dom";
import { MyPageEmptyIcon } from "../MyPageEmptyIcon";

export const MyPageInquiriesEmpty = () => (
  <div className="mypage-inquiries-empty" role="status">
    <MyPageEmptyIcon />
    <p className="mypage-inquiries-empty__message">작성한 문의가 없어요</p>
    <Link to="/mypage/inquiries/new" className="mypage-inquiries-empty__cta">
      1:1 문의하기
    </Link>
  </div>
);
