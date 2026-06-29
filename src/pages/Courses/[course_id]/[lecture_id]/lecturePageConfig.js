import { COURSE_ENROLLMENT_PERIOD } from "../courseDetailConfig";

export const LECTURE_TABS = [
  { id: "curriculum", label: "교육과정" },
  { id: "qna", label: "QnA" },
];

export const LECTURE_COMPLETION_NOTE = "90% 이상 시청 시 완료 처리됩니다";

/** 강의 상세 QnA — 페이지당 5건, 6건 이상일 때 PaginationNav 표시 */
export const LECTURE_QNA_POSTS_PER_PAGE = 5;

export function formatPlaybackTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function countLecturesInCourse(course) {
  return (course?.sections ?? []).reduce(
    (sum, section) => sum + (section.lectures?.length ?? 0),
    0,
  );
}

export function getCourseTotalLectureCount(course, enrollmentData) {
  const fromApi = Number(course?.total_lecture_count);
  if (fromApi > 0) return fromApi;

  const fromSections = countLecturesInCourse(course);
  if (fromSections > 0) return fromSections;

  const completed = Number(enrollmentData?.completed_lecture_count);
  if (enrollmentData?.is_completed && completed > 0) {
    return completed;
  }

  return 0;
}

export function getCompletedLectureCount(enrollmentProgress, enrollmentData) {
  const fromProgress =
    enrollmentProgress?.filter((item) => item.is_completed)?.length ?? 0;
  const fromEnrollment = Number(enrollmentData?.completed_lecture_count);

  if (Number.isFinite(fromEnrollment) && fromEnrollment >= 0) {
    return Math.max(fromProgress, fromEnrollment);
  }

  return fromProgress;
}

export function getLectureProgressPercent(
  enrollmentProgress,
  totalLectureCount,
  enrollmentData,
) {
  const total = Number(totalLectureCount) || 0;
  const completed = getCompletedLectureCount(
    enrollmentProgress,
    enrollmentData,
  );

  if (total > 0 && completed >= 0) {
    if (enrollmentData?.is_completed) {
      return 100;
    }
    return Math.min(100, Math.round((completed / total) * 100));
  }

  const enrollmentRate = Number(enrollmentData?.progress);
  if (Number.isFinite(enrollmentRate) && enrollmentRate >= 0) {
    return Math.min(100, Math.round(enrollmentRate));
  }

  return 0;
}

export function getEnrollmentPeriodLabel(enrollmentData) {
  if (!enrollmentData) return "";
  return `수강기한 ${COURSE_ENROLLMENT_PERIOD}`;
}

export function getSectionSummary(section) {
  const durationLabel =
    section?.duration ||
    section?.lectures?.[0]?.video_duration ||
    section?.lectures?.[0]?.videoDuration;
  if (durationLabel) {
    return `${durationLabel}`;
  }
}

export function findSectionIdForLecture(sections, lectureId) {
  const id = Number(lectureId);
  for (const section of sections ?? []) {
    if (section.lectures?.some((lecture) => Number(lecture.id) === id)) {
      return section.id;
    }
  }
  return sections?.[0]?.id ?? null;
}
