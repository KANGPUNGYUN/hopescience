import React from "react";
import mainImage from "../../../images/main.png";
import { CoursePlaySmallIcon } from "../icons/CourseDetailIcons";
import { CourseDetailAside } from "./CourseDetailAside";
import { getCourseMetaRows } from "./courseDetailConfig";

export const CourseDetailHero = ({
  course,
  enrollmentData,
  isCourseCompleted,
  myUserId,
  onPreviewClick,
}) => {
  const metaRows = getCourseMetaRows(course);

  return (
    <section className="course-detail-hero" aria-label="강의 소개">
      <div className="course-detail-hero__layout">
        <div className="course-detail-hero__preview">
          <div className="course-detail-hero__image-wrap">
            <img
              className="course-detail-hero__image"
              src={course?.thumbnail || mainImage}
              alt=""
            />
          </div>
          {!enrollmentData && (
            <button
              type="button"
              className="course-detail-hero__preview-btn"
              onClick={onPreviewClick}
            >
              <span>미리보기</span>
              <CoursePlaySmallIcon />
            </button>
          )}
        </div>

        <div className="course-detail-hero__aside-inline">
          <CourseDetailAside
            course={course}
            enrollmentData={enrollmentData}
            isCourseCompleted={isCourseCompleted}
            myUserId={myUserId}
          />
        </div>
      </div>

      <div
        className={`course-detail-hero__meta-mobile${
          enrollmentData ? " course-detail-hero__meta-mobile--enrolled" : ""
        }`}
      >
        {enrollmentData ? (
          <CourseDetailAside
            course={course}
            enrollmentData={enrollmentData}
            isCourseCompleted={isCourseCompleted}
            myUserId={myUserId}
          />
        ) : (
          <>
            <h1 className="course-detail-hero__title-mobile">{course?.title}</h1>
            <dl className="course-detail-hero__meta-list">
              {metaRows.slice(2).map((row) => (
                <div key={row.label} className="course-detail-hero__meta-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </section>
  );
};
