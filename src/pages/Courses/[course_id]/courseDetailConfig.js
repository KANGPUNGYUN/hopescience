export const COURSE_DETAIL_TABS = [
  { id: "description", label: "상세설명" },
  { id: "curriculum", label: "교육과정" },
  { id: "qna", label: "QnA" },
];

export const COURSE_CERTIFICATE_NOTE = "전체 강의 수강 완료 후 제공";

const OPEN_EVENT_REMOVAL_PATTERNS = [
  /오픈\s*기념\s*이벤트!?\s*/gi,
  /오픈\s*기념으로\s*(?:한\s*달|한달)\s*동안은?\s*테스트\s*없이\s*수료증을?\s*바로\s*출력\s*가능하십니다\.?\s*/gi,
  /\*?\s*이벤트\s*:\s*테스트\s*없이\s*바로\s*출력\s*가능\s*\*?/gi,
  /제공\s*\(\s*\*\s*이벤트\s*:[^)]*\)\s*/gi,
];

export function sanitizeCourseDescription(description) {
  if (typeof description !== "string" || !description.trim()) {
    return description;
  }

  let text = description;
  for (const pattern of OPEN_EVENT_REMOVAL_PATTERNS) {
    text = text.replace(pattern, "");
  }

  return text.replace(/\n{3,}/g, "\n\n").trim();
}

export const COURSE_ENROLLMENT_PERIOD = "무제한";

export function formatCoursePriceParts(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return { amount: "", unit: "원" };
  }
  return { amount: value.toLocaleString(), unit: "원" };
}

export function getCourseMetaRows(course) {
  const sectionCount = course?.sections?.length ?? 0;
  const lectureCount =
    course?.total_lecture_count ??
    course?.sections?.reduce(
      (sum, section) => sum + (section.lectures?.length ?? 0),
      0
    ) ??
    0;

  return [
    {
      label: "교육과정",
      value: sectionCount > 0 ? `${sectionCount}개` : `${lectureCount}개`,
    },
    {
      label: "교육시간",
      value: course?.duration || course?.total_duration || "-",
    },
    { label: "수강기한", value: COURSE_ENROLLMENT_PERIOD },
    { label: "수료증", value: COURSE_CERTIFICATE_NOTE },
  ];
}

export function maskUserName(name) {
  if (!name || name.length < 2) return name || "";
  return `${name[0]}*${name.slice(-1)}`;
}

export function formatQnaDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

export function getCommentCount(inquiry) {
  if (Array.isArray(inquiry?.comments)) return inquiry.comments.length;
  if (typeof inquiry?.comment_count === "number") return inquiry.comment_count;
  return 0;
}

export function isEnrollmentLectureCompleted(enrollmentProgress, lectureId) {
  if (lectureId == null || !enrollmentProgress?.length) return false;
  const id = Number(lectureId);
  return enrollmentProgress.some(
    (item) => Number(item.lecture_id) === id && Boolean(item.is_completed)
  );
}
