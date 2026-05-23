export const COURSES_HERO = {
  label: "ONLINE EDUCATION PROGRAMS",
  title: "상황에 맞는\n교육 과정을 선택해보세요",
  subtitle: "사건 유형별 온라인 교육 과정을 안내드립니다",
};

export const COURSE_CARD_META = "온라인 수강 가능 · 이수증 발급 지원";

/** Pencil Zs0oS (desktop) / qCE5H (mobile) */
export const COURSE_CARD_LAYOUT = {
  desktop: { width: 405, height: 412, mediaHeight: 228, bodyHeight: 184 },
  mobile: { width: 343, height: 335, mediaHeight: 193, bodyHeight: 142 },
};

export const COURSES_GRID = {
  columnWidth: 405,
  gap: 32,
  maxWidth: 1280,
};

export const COURSES_FILTERS = [
  { id: "all", label: "전체" },
  {
    id: "sex-offense",
    label: "성범죄 재범방지",
    keywords: ["성범죄", "성범"],
  },
  {
    id: "sentencing",
    label: "양형 관련",
    keywords: ["양형"],
  },
  {
    id: "drunk-driving",
    label: "음주운전 재범방지",
    keywords: ["음주", "음주운전"],
  },
];

const NEW_COURSE_DAYS = 30;

export function matchesCourseFilter(course, filterId) {
  if (filterId === "all") return true;

  const filter = COURSES_FILTERS.find((item) => item.id === filterId);
  if (!filter?.keywords) return true;

  const haystack = `${course.title || ""} ${course.category || ""}`.toLowerCase();
  return filter.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

export function getCourseTags(course) {
  const tags = [];
  const enrollmentCount =
    course.enrollment_count ?? course.enrollmentCount ?? null;

  if (typeof enrollmentCount === "number" && enrollmentCount > 0) {
    tags.push({
      variant: "primary",
      label: `누적 수강 ${enrollmentCount.toLocaleString()}건`,
    });
  }

  const createdAt = course.created_at ? new Date(course.created_at) : null;
  const isNew =
    createdAt &&
    Date.now() - createdAt.getTime() < NEW_COURSE_DAYS * 24 * 60 * 60 * 1000;
  const hasDiscount =
    typeof course.price === "number" &&
    typeof course.discounted_price === "number" &&
    course.discounted_price < course.price;

  if (isNew) {
    tags.push({ variant: "light", label: "신규 과정" });
  }
  if (hasDiscount) {
    tags.push({ variant: "light", label: "할인이벤트" });
  }

  return tags;
}

export function formatCoursePrice(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  return `${value.toLocaleString()}원`;
}
