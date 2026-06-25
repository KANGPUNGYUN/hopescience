import React from "react";
import { Link } from "react-router-dom";
import { formatCoursePriceParts } from "./courseDetailConfig";

export const CourseMobileBar = ({ course, myUserId, visible }) => {
  if (!visible) return null;

  const price = formatCoursePriceParts(
    course?.discounted_price ?? course?.price
  );

  return (
    <div className="course-detail-mobile-bar" role="region" aria-label="수강 신청">
      <div className="course-detail-mobile-bar__price">
        <strong>{price.amount}</strong>
        <span>{price.unit}</span>
      </div>
      {myUserId ? (
        <Link
          to={`/cart/${myUserId}/${course?.id}`}
          className="course-detail-mobile-bar__cta"
        >
          수강 신청하기
        </Link>
      ) : (
        <Link to="/signin" className="course-detail-mobile-bar__cta">
          수강 신청하기
        </Link>
      )}
    </div>
  );
};
