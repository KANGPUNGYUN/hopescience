import React, { useEffect, useRef, useState } from "react";
import { CourseChevronDownSmallIcon } from "../icons/CourseDetailIcons";

const COLLAPSED_MAX_HEIGHT = 320;

export const CourseDetailDescription = ({ description, sectionRef }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setNeedsToggle(el.scrollHeight > COLLAPSED_MAX_HEIGHT + 8);
  }, [description]);

  return (
    <section
      ref={sectionRef}
      id="course-section-description"
      className="course-detail-section"
      aria-labelledby="course-description-title"
    >
      <h2 id="course-description-title" className="course-detail-section__title">
        상세설명
      </h2>
      <div
        className={`course-detail-description__body${
          expanded ? "" : " course-detail-description__body--collapsed"
        }`}
      >
        <pre ref={contentRef} className="course-detail-description__text">
          {description || "상세 설명이 준비 중입니다."}
        </pre>
      </div>
      {needsToggle && (
        <button
          type="button"
          className="course-detail-description__more"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          <span>{expanded ? "접기" : "더보기"}</span>
          <CourseChevronDownSmallIcon
            className={
              expanded
                ? "course-detail-description__more-icon course-detail-description__more-icon--up"
                : "course-detail-description__more-icon"
            }
          />
        </button>
      )}
    </section>
  );
};
