import certificationImage from "../../images/v2/certification.png";
import certificationImage02 from "../../images/v2/certification02.png";
import certificationImage03 from "../../images/v2/certification03.png";

export const HOME_CERTIFICATE_SECTION = {
  label: "CERTIFICATE OF COMPLETION",
  titleLines: ["단순한 종이가 아닙니다", "교육 과정의 수료를 증명하는 문서입니다"],
  description:
    "본 센터의 수료증은 수천 건의 실제 제출 과정에서 활용되고 있습니다",
};

const BASE_CERTIFICATES = [
  {
    id: "sex-offense",
    image: certificationImage03,
    title: "성범죄 재범방지 교육",
  },
  {
    id: "drunk-driving",
    image: certificationImage,
    title: "음주운전 재범방지 교육",
  },
  {
    id: "addiction",
    image: certificationImage02,
    title: "중독범죄 예방 심리교육",
  },
];

const repeatCertificates = (list, times = 4) =>
  Array.from({ length: times }, (_, setIndex) =>
    list.map((item) => ({
      ...item,
      id: `${item.id}-${setIndex}`,
    }))
  ).flat();

export const HOME_CERTIFICATE_ROW_TOP = repeatCertificates(BASE_CERTIFICATES, 4);

export const HOME_CERTIFICATE_ROW_BOTTOM = repeatCertificates(
  [BASE_CERTIFICATES[2], BASE_CERTIFICATES[0], BASE_CERTIFICATES[1]],
  4
);
