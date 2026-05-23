import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LectureChevronDownIcon,
  LectureChevronUpIcon,
  LectureCompletedIcon,
  LectureInfoIcon,
  LectureUnwatchedIcon,
} from "./LectureIcons";
import {
  findSectionIdForLecture,
  getCompletedLectureCount,
  getCourseTotalLectureCount,
  getEnrollmentPeriodLabel,
  getLectureProgressPercent,
  getSectionSummary,
  LECTURE_COMPLETION_NOTE,
} from "./lecturePageConfig";

export const LectureCurriculumPanel = ({
  course,
  enrollmentData,
  enrollmentProgress = [],
  hideSidebarHeader = false,
}) => {
  const { course_id, lecture_id } = useParams();
  const sections = course?.sections ?? [];

  const [openSectionId, setOpenSectionId] = useState(() =>
    findSectionIdForLecture(sections, lecture_id)
  );
  useEffect(() => {
    setOpenSectionId(findSectionIdForLecture(sections, lecture_id));
  }, [sections, lecture_id]);

  const totalCount = getCourseTotalLectureCount(course, enrollmentData);
  const completedCount = getCompletedLectureCount(
    enrollmentProgress,
    enrollmentData
  );
  const progressPercent = getLectureProgressPercent(
    enrollmentProgress,
    totalCount,
    enrollmentData
  );

  const isLectureCompleted = (id) =>
    enrollmentProgress?.some(
      (item) => Number(item.lecture_id) === Number(id) && item.is_completed
    );

  const toggleSection = (sectionId) => {
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="lecture-curriculum">
      {!hideSidebarHeader && (
        <div className="lecture-curriculum__head">
          <h2 className="lecture-curriculum__course-title">{course?.title}</h2>
          <p className="lecture-curriculum__period">
            {getEnrollmentPeriodLabel(enrollmentData)}
          </p>
        </div>
      )}

      <div className="lecture-curriculum__progress">
        <div className="lecture-curriculum__progress-row">
          <span className="lecture-curriculum__progress-label">진행률</span>
          <span className="lecture-curriculum__progress-count">
            {completedCount}/{totalCount}강
          </span>
        </div>
        <div
          className="lecture-curriculum__progress-track"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className="lecture-curriculum__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="lecture-curriculum__note">
          <LectureInfoIcon size={18} />
          <span>{LECTURE_COMPLETION_NOTE}</span>
        </p>
      </div>

      <div className="lecture-curriculum__chapters">
        {sections.map((section) => {
          const isOpen = openSectionId === section.id;

          return (
            <div
              key={section.id}
              className={`lecture-curriculum__chapter${
                isOpen ? " lecture-curriculum__chapter--open" : ""
              }`}
            >
              <button
                type="button"
                className="lecture-curriculum__chapter-head"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
              >
                <span className="lecture-curriculum__chapter-title">
                  {section.title}
                </span>
                <span className="lecture-curriculum__chapter-meta">
                  {getSectionSummary(section)}
                </span>
                {isOpen ? <LectureChevronUpIcon /> : <LectureChevronDownIcon />}
              </button>

              {isOpen && (
                <ul className="lecture-curriculum__lessons">
                  {section.lectures?.map((lecture) => {
                    const completed = isLectureCompleted(lecture.id);
                    const isActive = Number(lecture.id) === Number(lecture_id);

                    return (
                      <li key={lecture.id}>
                        <Link
                          to={`/courses/${course_id}/${lecture.id}`}
                          className={`lecture-curriculum__lesson${
                            isActive ? " lecture-curriculum__lesson--active" : ""
                          }${completed ? " lecture-curriculum__lesson--done" : ""}`}
                        >
                          <span className="lecture-curriculum__lesson-icon" aria-hidden>
                            {completed ? (
                              <LectureCompletedIcon />
                            ) : (
                              <LectureUnwatchedIcon />
                            )}
                          </span>
                          <span className="lecture-curriculum__lesson-body">
                            <span className="lecture-curriculum__lesson-title">
                              {lecture.title}
                            </span>
                            {lecture.video_duration && (
                              <span className="lecture-curriculum__lesson-duration">
                                {lecture.video_duration}
                              </span>
                            )}
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
    </div>
  );
};
