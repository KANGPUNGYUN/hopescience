export const HOME_USER_REVIEWS_SECTION = {
  label: "USER REVIEWS",
  title: "실제 이용 후기",
  description:
    "실제 수강자들의 후기와 경험을 통해 교육 과정에 대한 정보를 확인해보실 수 있습니다",
};

export const HOME_USER_REVIEWS_FILTERS = [
  { id: "all", label: "전체" },
  { id: "drunk-driving", label: "음주운전" },
  { id: "sex-offense", label: "성범죄" },
  { id: "other", label: "기타" },
];

const normalizeReview = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");

export const HOME_USER_REVIEWS = [
  {
    id: "review-1",
    name: "김○수",
    date: "2025-07-20",
    category: "drunk-driving",
    review: normalizeReview(
      `이 교육 프로그램은 빠르게 이수증을 받을 수 있어 너무 좋았습니다.
바쁜 일정 속에서도 단기간에 이수할 수 있어서 큰 도움이 되었습니다.`
    ),
  },
  {
    id: "review-2",
    name: "박○연",
    date: "2025-07-17",
    category: "sex-offense",
    review: normalizeReview(
      `단기간에 이수증을 받을 수 있다는 점이 정말 만족스러웠습니다.
교육 과정 중 상담도 매우 친절하게 이루어져서 편안한 마음으로 수강할 수 있었습니다.`
    ),
  },
  {
    id: "review-3",
    name: "이○훈",
    date: "2025-06-16",
    category: "other",
    review: normalizeReview(
      `빠른 이수증 발급이 가능한 프로그램이라 시간 효율적으로 학습할 수 있었습니다.
상담 과정도 세심하게 배려해 주셔서 문제 없이 수료할 수 있었습니다.`
    ),
  },
  {
    id: "review-4",
    name: "윤○희",
    date: "2025-06-13",
    category: "drunk-driving",
    review: normalizeReview(
      `짧은 시간 안에 이수증을 받을 수 있어서 바쁜 일정을 소화하기에 딱 좋았습니다.
상담이 친절하고 상세해서 교육 과정 내내 만족스러웠습니다. 교육 덕분에 양형에 도움이 되어 큰 걱정을 덜 수 있었습니다.`
    ),
  },
  {
    id: "review-5",
    name: "최○호",
    date: "2025-07-12",
    category: "sex-offense",
    review: normalizeReview(
      `단기간에 이수증을 취득할 수 있어 매우 효율적이었습니다.
상담 또한 매우 친절하고 정확하게 해주셔서 수강 중에도 불편함이 없었습니다.`
    ),
  },
  {
    id: "review-6",
    name: "박○준",
    date: "2025-07-10",
    category: "other",
    review: normalizeReview(
      `상담을 친절하게 해주셔서 궁금한 점을 바로 해결할 수 있었습니다.
희망과학심리상담센터의 상담이 많은 사람에게 도움이 되었으면 좋겠습니다.`
    ),
  },
  {
    id: "review-7",
    name: "이○은",
    date: "2025-07-06",
    category: "drunk-driving",
    review: normalizeReview(
      `강의가 매우 체계적이고 이해하기 쉽게 구성되어 있어 많은 도움이 되었습니다.`
    ),
  },
  {
    id: "review-8",
    name: "오○현",
    date: "2025-07-04",
    category: "sex-offense",
    review: normalizeReview(
      `직접 대면해야 하는 불편함 없이 간단하게 영상으로 교육을 받고 이수할 수 있어서 좋았습니다.`
    ),
  },
  {
    id: "review-9",
    name: "서○빈",
    date: "2025-07-01",
    category: "other",
    review: normalizeReview(
      `희망과학심리상담센터의 재범 방지 교육이 정말 유익했습니다.
단기간에 이수증을 받을 수 있어 좋았고, 많은 것을 배울 수 있었습니다.`
    ),
  },
];
