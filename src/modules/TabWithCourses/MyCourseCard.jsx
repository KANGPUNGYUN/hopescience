import React from "react";
import { Link } from "react-router-dom";
import { MyPageCalendarIcon, MyPageClockIcon } from "../MyPageMetaIcons";

export const MyCourseCard = ({ course }) => {
  const continueHref = `/courses/${course.courseId}`;

  const isCompleted = course.status === "completed";
  const progressWidth = isCompleted
    ? 100
    : course.totalLectures > 0
      ? Math.round((course.completedLectures / course.totalLectures) * 100)
      : Math.min(100, Math.max(0, course.progress));
  const lectureLabel = `${course.completedLectures}/${course.totalLectures}강`;
  const metaRight = course.validityLabel || course.periodLabel || "무제한";

  return (
    <article
      className={`mypage-course-card${
        isCompleted ? " mypage-course-card--completed" : ""
      }`}
    >
      <div className="mypage-course-card__top">
        <span
          className={`mypage-course-card__badge${
            isCompleted
              ? " mypage-course-card__badge--done"
              : " mypage-course-card__badge--active"
          }`}
        >
          {course.statusLabel}
        </span>
        <span className="mypage-course-card__meta">{metaRight}</span>
      </div>

      <h3 className="mypage-course-card__title">{course.title}</h3>

      <div className="mypage-course-card__progress-head">
        <span className="mypage-course-card__progress-label">진행률</span>
        <span className="mypage-course-card__progress-value">{lectureLabel}</span>
      </div>
      <div
        className="mypage-course-card__progress-bar"
        role="progressbar"
        aria-valuenow={progressWidth}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="mypage-course-card__progress-fill"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      <div className="mypage-course-card__dates">
        <div className="mypage-course-card__date-col">
          <span className="mypage-course-card__date-label">
            <span className="mypage-course-card__date-icon" aria-hidden>
              <MyPageCalendarIcon />
            </span>
            교육 시작일
          </span>
          <span className="mypage-course-card__date-value">
            {course.startDateLabel}
          </span>
        </div>
        <div className="mypage-course-card__date-col">
          <span className="mypage-course-card__date-label">
            <span className="mypage-course-card__date-icon" aria-hidden>
              <MyPageClockIcon />
            </span>
            {course.endDateTitle}
          </span>
          <span className="mypage-course-card__date-value">
            {course.endDateLabel}
          </span>
        </div>
      </div>

      {isCompleted ? (
        <Link
          to="/mypage/certificates"
          className="mypage-course-card__btn mypage-course-card__btn--secondary"
        >
          수료증 확인하기
        </Link>
      ) : (
        <Link
          to={continueHref}
          className="mypage-course-card__btn mypage-course-card__btn--primary"
        >
          계속 진행하기
        </Link>
      )}
    </article>
  );
};
