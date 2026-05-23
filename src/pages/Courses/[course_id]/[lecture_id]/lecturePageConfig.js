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

export function getLectureProgressPercent(enrollmentProgress, totalLectureCount) {
  const total = Number(totalLectureCount) || 0;
  if (!total) return 0;
  const completed =
    enrollmentProgress?.filter((item) => item.is_completed)?.length ?? 0;
  return Math.min(100, Math.round((completed / total) * 100));
}

export function getCompletedLectureCount(enrollmentProgress) {
  return enrollmentProgress?.filter((item) => item.is_completed)?.length ?? 0;
}

export function getEnrollmentPeriodLabel(enrollmentData) {
  if (!enrollmentData) return "";
  return `수강기한 ${COURSE_ENROLLMENT_PERIOD}`;
}

export function getSectionSummary(section) {
  const count = section?.lectures?.length ?? 0;
  const durationLabel =
    section?.duration ||
    section?.lectures?.[0]?.video_duration ||
    section?.lectures?.[0]?.videoDuration;
  if (durationLabel) {
    return `${count}강 · ${durationLabel}`;
  }
  return `${count}강`;
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
