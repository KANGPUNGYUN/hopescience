import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { PageLoadingSpinner } from "./PageLoadingSpinner";
import { useAssetPreload, useMinLoadingDuration } from "./useAssetPreload";
import "./PageLoading.css";

/**
 * 전체 화면(또는 영역) 로딩 UI — 스피너 + 리소스 다운로드 진행률 + 안내 문구
 *
 * @param {string[]} sources - 프리로드할 에셋 URL (미지정 시 progress prop 사용)
 * @param {number} [progress] - 외부 진행률 0~100
 * @param {() => void} [onComplete] - 로딩 완료 시 (sources 모드: 100% + 최소 표시 시간 후)
 * @param {boolean} [fullscreen=true]
 */
export const PageLoading = ({
  sources,
  progress: externalProgress,
  onComplete,
  message = "잠시만 기다려주세요",
  fullscreen = true,
  layout = "fullscreen",
  showPercent = true,
  showProgressBar = true,
  minDurationMs = 400,
}) => {
  const useInternalPreload = sources != null;
  const { progress: preloadProgress, isComplete: preloadComplete } = useAssetPreload(
    useInternalPreload ? sources : []
  );

  const progress = useInternalPreload
    ? preloadProgress
    : Math.min(100, Math.max(0, externalProgress ?? 0));

  const isComplete = useInternalPreload
    ? preloadComplete
    : progress >= 100;

  const canDismiss = useMinLoadingDuration(isComplete, minDurationMs);

  useEffect(() => {
    if (canDismiss && onComplete) {
      onComplete();
    }
  }, [canDismiss, onComplete]);

  const rootClass = [
    "page-loading",
    layout === "below-header"
      ? "page-loading--below-header"
      : fullscreen
        ? "page-loading--fullscreen"
        : "page-loading--inline",
  ].join(" ");

  return (
    <div
      className={rootClass}
      role="status"
      aria-live="polite"
      aria-busy={!isComplete}
      aria-label={message}
    >
      <div className="page-loading__spinner">
        <PageLoadingSpinner />
      </div>

      <div className="page-loading__body">
        <p className="page-loading__message">{message}</p>

        {showProgressBar ? (
          <div className="page-loading__progress">
            <div className="page-loading__progress-track">
              <div
                className="page-loading__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            {showPercent ? (
              <span className="page-loading__progress-label">
                리소스 다운로드 <strong>{progress}%</strong>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

PageLoading.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.string),
  progress: PropTypes.number,
  onComplete: PropTypes.func,
  message: PropTypes.string,
  fullscreen: PropTypes.bool,
  layout: PropTypes.oneOf(["fullscreen", "below-header", "inline"]),
  showPercent: PropTypes.bool,
  showProgressBar: PropTypes.bool,
  minDurationMs: PropTypes.number,
};
