import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CourseChevronDownIcon,
  CourseChevronUpIcon,
  CourseLockIcon,
  CoursePlayCircleIcon,
} from "../icons/CourseDetailIcons";

export const CourseCurriculum = ({
  sections = [],
  enrollmentData,
  enrollmentProgress = [],
  sectionRef,
}) => {
  const { course_id } = useParams();
  const [openSectionId, setOpenSectionId] = useState(
    sections[0]?.id ?? null
  );

  const toggleSection = (sectionId) => {
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  const isLectureCompleted = (lectureId) =>
    enrollmentProgress?.some(
      (item) => item.lecture_id === lectureId && item.is_completed
    );

  return (
    <section
      ref={sectionRef}
      id="course-section-curriculum"
      className="course-detail-section"
      aria-labelledby="course-curriculum-title"
    >
      <h2 id="course-curriculum-title" className="course-detail-section__title">
        교육과정
      </h2>
      <div className="course-curriculum">
        {sections.map((section) => {
          const isOpen = openSectionId === section.id;

          return (
            <div
              key={section.id}
              className={`course-curriculum__chapter${
                isOpen ? " course-curriculum__chapter--open" : ""
              }`}
            >
              <button
                type="button"
                className="course-curriculum__chapter-head"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
              >
                <span>{section.title}</span>
                {isOpen ? <CourseChevronUpIcon /> : <CourseChevronDownIcon />}
              </button>
              {isOpen && (
                <ul className="course-curriculum__lessons">
                  {section.lectures?.map((lecture) => {
                    const locked = !enrollmentData;
                    const completed = isLectureCompleted(lecture.id);

                    if (locked) {
                      return (
                        <li key={lecture.id}>
                          <button
                            type="button"
                            className="course-curriculum__lesson course-curriculum__lesson--locked"
                            onClick={() =>
                              alert("구매 후에 이용이 가능합니다.")
                            }
                          >
                            <span className="course-curriculum__lesson-title">
                              <CoursePlayCircleIcon />
                              {lecture.title}
                            </span>
                            <CourseLockIcon />
                          </button>
                        </li>
                      );
                    }

                    return (
                      <li key={lecture.id}>
                        <Link
                          to={`/courses/${course_id}/${lecture.id}`}
                          className={`course-curriculum__lesson${
                            completed
                              ? " course-curriculum__lesson--completed"
                              : ""
                          }`}
                        >
                          <span className="course-curriculum__lesson-title">
                            <CoursePlayCircleIcon />
                            {lecture.title}
                            {lecture.video_duration
                              ? ` (${lecture.video_duration})`
                              : ""}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
