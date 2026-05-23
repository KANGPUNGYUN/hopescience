import mainBannerImage from "../../images/v2/main.png";
import logoBlack from "../../images/v2/logo-black.png";
import bannerImage from "../../images/v2/banner.png";
import reviewsBg from "../../images/v2/reviews-bg.png";
import footerBg from "../../images/v2/footer-bg.png";
import certificationImage from "../../images/v2/certification.png";

/** 앱 최초 진입 시 프리로드할 홈 핵심 이미지 */
export const APP_INITIAL_ASSETS = [
  mainBannerImage,
  logoBlack,
  bannerImage,
  reviewsBg,
  footerBg,
  certificationImage,
];

/**
 * 경로별 추가 프리로드 목록 (필요 시 확장)
 * @param {string} pathname
 * @returns {string[]}
 */
export function getPageLoadingAssets(pathname) {
  if (!pathname || pathname === "/") {
    return APP_INITIAL_ASSETS;
  }
  return [];
}
