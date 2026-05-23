export const formatDotDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

const resolveTotalLectureCount = (course, completedLectures, isCompleted) => {
  const fromApi = Number(course.total_lecture_count);
  if (fromApi > 0) return fromApi;

  if (isCompleted && completedLectures > 0) {
    return completedLectures;
  }

  const progress = Number(course.progress) || 0;
  if (progress > 0 && completedLectures > 0) {
    return Math.max(
      completedLectures,
      Math.round(completedLectures / (progress / 100))
    );
  }

  if (completedLectures > 0) {
    return completedLectures;
  }

  return 1;
};

export const mapEnrollmentToCourse = (course) => {
  const isCompleted = Boolean(course.is_completed);
  const completedLectures = Number.isFinite(
    Number(course.completed_lecture_count)
  )
    ? Number(course.completed_lecture_count)
    : 0;

  const totalLectures = resolveTotalLectureCount(
    course,
    completedLectures,
    isCompleted
  );

  const resolvedCompleted =
    completedLectures > 0
      ? completedLectures
      : Math.round((Number(course.progress) || 0) / 100 * totalLectures);

  return {
    id: course.id,
    title: course.course_title,
    courseId: course.course_id,
    progress: Number(course.progress) || 0,
    status: isCompleted ? "completed" : "in_progress",
    statusLabel: isCompleted ? "수료 완료" : "진행중",
    enrolledAt: course.enrolled_at,
    completedAt: course.completed_at,
    startDateLabel: formatDotDate(course.enrolled_at),
    endDateLabel: isCompleted
      ? formatDotDate(course.completed_at)
      : formatDotDate(course.last_accessed_at || course.updated_at),
    endDateTitle: isCompleted ? "이수 완료일" : "최근 학습일",
    completedLectures: Math.min(resolvedCompleted, totalLectures),
    totalLectures,
    validityLabel: course.valid_until
      ? `유효기간 : ${formatDotDate(course.valid_until)}`
      : course.expires_at
        ? `유효기간 : ${formatDotDate(course.expires_at)}`
        : null,
    periodLabel: course.course_period
      ? `수강기간: ${formatDotDate(course.course_period)}`
      : null,
  };
};

export const filterCoursesByTab = (courses, tab) => {
  if (tab === "enrolled") {
    return courses.filter((c) => c.status !== "completed");
  }
  if (tab === "completed") {
    return courses.filter((c) => c.status === "completed");
  }
  return courses;
};

const EMPTY_SUMMARY_DEFAULT_LECTURES = 8;

export const computeSummary = (courses) => {
  if (courses.length === 0) {
    return {
      total: 0,
      completedLectures: 0,
      totalLectures: EMPTY_SUMMARY_DEFAULT_LECTURES,
      overallPercent: 0,
      completedRatioLabel: `0/${EMPTY_SUMMARY_DEFAULT_LECTURES}`,
    };
  }

  const totalLectures = courses.reduce((sum, c) => sum + c.totalLectures, 0);
  const completedLectures = courses.reduce(
    (sum, c) => sum + c.completedLectures,
    0
  );
  const overallPercent =
    totalLectures > 0
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

  return {
    total: courses.length,
    completedLectures,
    totalLectures,
    overallPercent,
    completedRatioLabel: `${completedLectures}/${totalLectures}`,
  };
};
