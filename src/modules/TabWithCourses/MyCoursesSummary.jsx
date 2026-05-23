import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WeeklyStudyChart } from "./WeeklyStudyChart";
import { useAnimateFromZero } from "./useAnimateFromZero";
import { SUMMARY_ANIMATION } from "./weeklyStudyChartConfig";
import "./WeeklyStudyChart.css";

export const MyCoursesSummary = ({ summary, weeklyStudyData }) => {
  const location = useLocation();
  const {
    total,
    overallPercent,
    completedRatioLabel,
    completedLectures,
    totalLectures,
  } = summary;

  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotionEnabled(!reduced);
  }, []);

  const { durationMs, delayMs } = SUMMARY_ANIMATION;

  const animatedPercent = useAnimateFromZero(overallPercent, {
    duration: durationMs,
    delay: delayMs,
    enabled: motionEnabled,
  });

  const animatedCompleted = useAnimateFromZero(completedLectures, {
    duration: durationMs,
    delay: delayMs,
    enabled: motionEnabled,
  });

  const ratioLabel =
    totalLectures > 0
      ? `${animatedCompleted}/${totalLectures}`
      : completedRatioLabel;

  return (
    <section className="mypage-summary" aria-label="학습 요약">
      <div className="mypage-summary__overall">
        <div className="mypage-summary__overall-head">
          <h3 className="mypage-summary__label">전체 진행률</h3>
          <span
            className="mypage-summary__percent mypage-summary__percent--animated"
            aria-live="polite"
          >
            {animatedPercent}%
          </span>
        </div>
        <div className="mypage-summary__ratio">
          <strong className="mypage-summary__ratio-value">{ratioLabel}</strong>
          <span>완료 강의 수 / 전체 강의 수</span>
        </div>
        <div
          className="mypage-summary__bar"
          role="progressbar"
          aria-valuenow={overallPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="mypage-summary__bar-fill mypage-summary__bar-fill--animated"
            style={{ width: `${animatedPercent}%` }}
          />
        </div>
        <div className="mypage-summary__study-time">
          <span className="mypage-summary__label">전체 학습시간</span>
          <span className="mypage-summary__time-value">
            {total > 0 ? "—" : "0시간 0분"}
          </span>
        </div>
      </div>

      <div className="mypage-summary__divider" aria-hidden />

      <div className="mypage-summary__weekly">
        <div className="mypage-summary__weekly-head">
          <h3 className="mypage-summary__label">주간 학습시간</h3>
          <span className="mypage-summary__recent">최근 7일</span>
        </div>
        <WeeklyStudyChart
          key={`weekly-study-chart-${location.key}`}
          data={weeklyStudyData}
          animate={motionEnabled}
          animationDelay={delayMs}
          animationDuration={durationMs}
        />
      </div>
    </section>
  );
};
