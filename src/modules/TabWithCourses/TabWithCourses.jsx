import React, { useEffect, useState, useMemo } from "react";
import "./TabWithCourses.css";
import { auth, enrollment, user } from "../../store";
import { MyCoursesSummary } from "./MyCoursesSummary";
import { MyCourseCard } from "./MyCourseCard";
import { MyCoursesEmpty } from "./MyCoursesEmpty";
import {
  mapEnrollmentToCourse,
  filterCoursesByTab,
  computeSummary,
  toWeeklyChartData,
  formatHoursMinutes,
} from "./myCoursesUtils";

const TAB_ITEMS = [
  { key: "all", label: "전체" },
  { key: "enrolled", label: "진행중" },
  { key: "completed", label: "수료 완료" },
];

export const TabWithCourses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [courses, setCourses] = useState([]);

  const { getUserEnrollments, enrollments, clearEnrollments, isLoading } =
    enrollment((state) => ({
      getUserEnrollments: state.getUserEnrollments,
      enrollments: state.enrollments,
      clearEnrollments: state.clearEnrollments,
      isLoading: state.isLoading,
    }));

  const { getStudyStats, studyStats, clearStudyStats } = user((state) => ({
    getStudyStats: state.getStudyStats,
    studyStats: state.studyStats,
    clearStudyStats: state.clearStudyStats,
  }));

  const myUserId = auth((state) => state.user?.userId);

  useEffect(() => {
    clearEnrollments();
    clearStudyStats();
    if (!myUserId) return;

    getUserEnrollments(myUserId);
    getStudyStats();
  }, [
    clearEnrollments,
    clearStudyStats,
    getUserEnrollments,
    getStudyStats,
    myUserId,
  ]);

  useEffect(() => {
    if (enrollments.length > 0) {
      setCourses(enrollments.map(mapEnrollmentToCourse));
    } else if (!isLoading) {
      setCourses([]);
    }
  }, [enrollments, isLoading]);

  const summary = useMemo(() => computeSummary(courses), [courses]);
  const visibleCourses = useMemo(
    () => filterCoursesByTab(courses, activeTab),
    [courses, activeTab]
  );

  const weeklyStudyData = useMemo(
    () => toWeeklyChartData(studyStats?.weekly_study),
    [studyStats]
  );

  const lifetimeStudyLabel = useMemo(
    () => formatHoursMinutes(studyStats?.lifetime_total_seconds),
    [studyStats]
  );

  return (
    <div className="mypage-courses">
      <MyCoursesSummary
        summary={summary}
        weeklyStudyData={weeklyStudyData}
        lifetimeStudyLabel={lifetimeStudyLabel}
      />

      <div className="mypage-courses__tabs" role="tablist" aria-label="수강 필터">
        {TAB_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            className={`mypage-courses__tab${
              activeTab === key ? " mypage-courses__tab--active" : ""
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mypage-courses__loading">불러오는 중...</p>
      ) : courses.length === 0 ? (
        <MyCoursesEmpty />
      ) : visibleCourses.length === 0 ? (
        <p className="mypage-courses__empty-tab">
          해당 조건의 교육 과정이 없습니다.
        </p>
      ) : (
        <ul className="mypage-courses__grid">
          {visibleCourses.map((course) => (
            <li key={course.id}>
              <MyCourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
