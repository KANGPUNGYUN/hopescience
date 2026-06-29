import React from "react";
import { Link } from "react-router-dom";
import {
  COURSE_CERTIFICATE_NOTE,
  COURSE_ENROLLMENT_PERIOD,
  formatCoursePriceParts,
  getCourseMetaRows,
} from "./courseDetailConfig";

export const CourseDetailAside = ({
  course,
  enrollmentData,
  isCourseCompleted,
  myUserId,
}) => {
  if (!course) return null;

  if (enrollmentData) {
    return (
      <EnrolledAside
        course={course}
        enrollmentData={enrollmentData}
        isCourseCompleted={isCourseCompleted}
      />
    );
  }

  const price = formatCoursePriceParts(
    course?.discounted_price ?? course?.price
  );
  const originalPrice =
    typeof course?.price === "number" &&
    typeof course?.discounted_price === "number" &&
    course.discounted_price < course.price
      ? formatCoursePriceParts(course.price)
      : null;
  const metaRows = getCourseMetaRows(course);

  return (
    <PurchaseAside
      course={course}
      price={price}
      originalPrice={originalPrice}
      metaRows={metaRows}
      myUserId={myUserId}
    />
  );
};

const PurchaseAside = ({
  course,
  price,
  originalPrice,
  metaRows,
  myUserId,
}) => (
  <div className="course-detail-card">
    <h1 className="course-detail-card__title">{course?.title}</h1>
    <div className="course-detail-card__price">
      {originalPrice && (
        <span className="course-detail-card__price-original">
          {originalPrice.amount}
          {originalPrice.unit}
        </span>
      )}
      <span className="course-detail-card__price-sale">
        <strong>{price.amount}</strong>
        <span className="course-detail-card__price-unit">{price.unit}</span>
      </span>
    </div>
    <dl className="course-detail-card__meta">
      {metaRows.map((row) => (
        <div key={row.label} className="course-detail-card__meta-row">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
    <div className="course-detail-card__divider" />
    {myUserId ? (
      <Link
        to={`/cart/${myUserId}/${course?.id}`}
        className="course-detail-card__cta"
      >
        수강 신청하기
      </Link>
    ) : (
      <Link to="/signin" className="course-detail-card__cta">
        수강 신청하기
      </Link>
    )}
  </div>
);

const EnrolledAside = ({ course, enrollmentData, isCourseCompleted }) => {
  const firstLectureId = course?.sections?.[0]?.lectures?.[0]?.id;
  const lectureLink = firstLectureId
    ? `/courses/${course.id}/${firstLectureId}`
    : `/courses/${course?.id}`;

  return (
    <div className="course-detail-card course-detail-card--enrolled">
      <h1 className="course-detail-card__title">{course?.title}</h1>
      <div className="course-detail-card__progress">
        <span className="course-detail-card__progress-label">진도율</span>
        <div className="course-detail-card__progress-bar">
          <div
            className="course-detail-card__progress-fill"
            style={{ width: `${enrollmentData?.progress ?? 0}%` }}
          />
        </div>
        <span className="course-detail-card__progress-text">
          {enrollmentData?.completed_lecture_count ?? 0}/
          {course?.total_lecture_count ?? 0} ({enrollmentData?.progress ?? 0}%)
        </span>
      </div>
      <Link to={lectureLink} className="course-detail-card__cta">
        수강하러 가기
      </Link>
      {isCourseCompleted && (
        <Link
          to="/mypage/certificates"
          className="course-detail-card__cta course-detail-card__cta--secondary"
        >
          이수증 발급하기
        </Link>
      )}
      <dl className="course-detail-card__meta">
        <div className="course-detail-card__meta-row">
          <dt>수강기한</dt>
          <dd>{COURSE_ENROLLMENT_PERIOD}</dd>
        </div>
        <div className="course-detail-card__meta-row">
          <dt>수료증</dt>
          <dd>{COURSE_CERTIFICATE_NOTE}</dd>
        </div>
      </dl>
    </div>
  );
};
