import videoImage01 from "../../images/v2/video.png";
import videoImage02 from "../../images/v2/video02.png";
import videoImage03 from "../../images/v2/video03.png";

export const HOME_EDUCATION_SECTION = {
  label: "ONLINE EDUCATION PROGRAMS",
  title: "법원이 인정하는 양형 자료,\n단 15분이면 충분합니다",
  subtitle: "재범방지 교육 과정부터 수료증 발급까지 지원합니다",
  moreLink: { label: "더보기", to: "/courses" },
};

export const HOME_EDUCATION_FALLBACK_COURSES = [
  {
    id: "fallback-1",
    title: "성범죄 재범방지 교육",
    description: "성범죄 재범 방지를 위한 이해와 실천 중심의 교육 과정입니다",
    thumbnail: videoImage01,
    videoUrl: null,
  },
  {
    id: "fallback-2",
    title: "음주운전 재범방지 교육",
    description: "",
    thumbnail: videoImage02,
    videoUrl: null,
  },
  {
    id: "fallback-3",
    title: "양형기준의 이해",
    description: "",
    thumbnail: videoImage03,
    videoUrl: null,
  },
];
