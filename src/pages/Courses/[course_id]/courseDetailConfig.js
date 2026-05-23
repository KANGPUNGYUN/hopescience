export const COURSE_DETAIL_TABS = [
  { id: "description", label: "상세설명" },
  { id: "curriculum", label: "교육과정" },
  { id: "qna", label: "QnA" },
];

export const COURSE_CERTIFICATE_NOTE =
  "제공 (* 이벤트 : 테스트 없이 바로 출력 가능)";

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
