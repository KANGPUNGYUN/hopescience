/** Pencil KVX5s / E9aAGN 주간 학습시간 차트 토큰 */
export const CHART_COLORS = {
  line: "#1e3960",
  dot: "#1e3960",
  grid: "#f1f1f5",
  areaStart: "#1e3960",
  areaEnd: "#1e3960",
  tooltipFill: "#ffffff",
  tooltipBorder: "#e5e5ec",
  tooltipDate: "#767676",
  tooltipCount: "#222222",
};

/** 디자인 곡선 형태에 맞춘 기본 7일 데이터 (강의 수) */
export const DEFAULT_WEEKLY_STUDY_DATA = [
  { date: "05.24", sessions: 2 },
  { date: "05.25", sessions: 2 },
  { date: "05.26", sessions: 5 },
  { date: "05.27", sessions: 3 },
  { date: "05.28", sessions: 3 },
  { date: "05.29", sessions: 5 },
  { date: "05.30", sessions: 3 },
];

/** 요약 카드(진행률 바·퍼센트)와 차트 입장 애니메이션 동기화 */
export const SUMMARY_ANIMATION = {
  durationMs: 1000,
  delayMs: 120,
  dotStaggerMs: 70,
};

export const CHART_ANIMATION = SUMMARY_ANIMATION;

/** 말풍선 hover 라벨 (최소 텍스트) */
export const formatWeeklyTooltip = (date, sessions) => `${date} ${sessions}개`;

export const formatWeeklyTooltipAria = (date, sessions) =>
  `${date}, 학습 ${sessions}개`;
