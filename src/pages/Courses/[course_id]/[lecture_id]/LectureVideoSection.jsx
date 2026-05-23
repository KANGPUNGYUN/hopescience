import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VideoPlayer } from "../../../../modules/VideoPlayer";
import {
  LectureExpandIcon,
  LectureNextIcon,
  LecturePlayIcon,
  LecturePrevIcon,
  LectureSettingsIcon,
  LectureVolumeIcon,
} from "./LectureIcons";
import { formatPlaybackTime } from "./lecturePageConfig";

export const LectureVideoSection = ({
  videoUrl,
  enrollmentData,
  lectureId,
  courseId,
  onVideoComplete,
  nextLecture,
  isLoading,
}) => {
  const shellRef = useRef(null);
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const handleReady = useCallback((player) => {
    playerRef.current = player;
    setVideoReady(true);
    player.getPaused().then(setPaused).catch(() => {});
  }, []);

  const handleTimeUpdate = useCallback((seconds, totalDuration) => {
    setCurrentTime(seconds);
    if (totalDuration) setDuration(totalDuration);
  }, []);

  const togglePlay = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;
    const isPaused = await player.getPaused();
    if (isPaused) {
      await player.play();
      setPaused(false);
    } else {
      await player.pause();
      setPaused(true);
    }
  }, []);

  const handleSeek = useCallback((e) => {
    const player = playerRef.current;
    if (!player || !duration) return;
    const ratio = Number(e.target.value) / 100;
    const nextTime = ratio * duration;
    player.setCurrentTime(nextTime);
    setCurrentTime(nextTime);
  }, [duration]);

  const handleFullscreen = useCallback(() => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    el.requestFullscreen?.();
  }, []);

  const progressValue = duration ? (currentTime / duration) * 100 : 0;

  const prevLink = nextLecture?.previous
    ? `/courses/${courseId}/${nextLecture.previous.lecture_id}`
    : null;
  const nextLink = nextLecture?.next
    ? `/courses/${courseId}/${nextLecture.next.lecture_id}`
    : null;

  return (
    <div className="lecture-video" ref={shellRef}>
      <div className="lecture-video__stage">
        {isLoading ? (
          <div className="lecture-video__loading">
            <div className="lecture-video__loader" />
          </div>
        ) : (
          <>
            <VideoPlayer
              videoUrl={videoUrl}
              enrollmentData={enrollmentData}
              lectureId={lectureId}
              course_id={courseId}
              onVideoComplete={onVideoComplete}
              useCustomChrome
              onPlayerReady={handleReady}
              onPlaybackTimeUpdate={handleTimeUpdate}
              onPlayStateChange={setPaused}
            />
            {videoReady && paused && (
              <button
                type="button"
                className="lecture-video__center-play"
                onClick={togglePlay}
                aria-label="재생"
              >
                <span className="lecture-video__center-play-bg" aria-hidden />
                <LecturePlayIcon size={24} />
              </button>
            )}
          </>
        )}
      </div>

      {!isLoading && (
        <div className="lecture-video__controls">
          <div className="lecture-video__controls-top">
            <input
              type="range"
              className="lecture-video__seek"
              min={0}
              max={100}
              step={0.1}
              value={progressValue}
              onChange={handleSeek}
              aria-label="재생 위치"
              style={{ "--seek-percent": `${progressValue}%` }}
            />
          </div>
          <div className="lecture-video__controls-bar">
            <div className="lecture-video__controls-left">
              <button
                type="button"
                className="lecture-video__icon-btn"
                onClick={togglePlay}
                aria-label={paused ? "재생" : "일시정지"}
              >
                <LecturePlayIcon size={18} />
              </button>
              <span className="lecture-video__time">
                {formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}
              </span>
              {prevLink ? (
                <Link to={prevLink} className="lecture-video__nav-link">
                  <LecturePrevIcon />
                  <span>이전 강의</span>
                </Link>
              ) : (
                <span className="lecture-video__nav-link lecture-video__nav-link--disabled">
                  <LecturePrevIcon />
                  <span>이전 강의</span>
                </span>
              )}
              {nextLink ? (
                <Link to={nextLink} className="lecture-video__nav-link">
                  <LectureNextIcon />
                  <span>다음 강의</span>
                </Link>
              ) : (
                <span className="lecture-video__nav-link lecture-video__nav-link--disabled">
                  <LectureNextIcon />
                  <span>다음 강의</span>
                </span>
              )}
            </div>
            <div className="lecture-video__controls-right">
              <button
                type="button"
                className="lecture-video__icon-btn"
                aria-label="음량"
              >
                <LectureVolumeIcon />
              </button>
              <button
                type="button"
                className="lecture-video__icon-btn"
                aria-label="설정"
              >
                <LectureSettingsIcon />
              </button>
              <button
                type="button"
                className="lecture-video__icon-btn"
                onClick={handleFullscreen}
                aria-label="전체 화면"
              >
                <LectureExpandIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
