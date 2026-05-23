import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VideoPlayer } from "../../../../modules/VideoPlayer";
import {
  LectureCompressIcon,
  LectureExpandIcon,
  LectureNextIcon,
  LecturePauseIcon,
  LecturePlayIcon,
  LecturePrevIcon,
  LectureSettingsIcon,
  LectureVolumeIcon,
  LectureVolumeMuteIcon,
} from "./LectureIcons";
import { formatPlaybackTime } from "./lecturePageConfig";

export const LectureVideoSection = ({
  videoUrl,
  enrollmentData,
  lectureId,
  courseId,
  onVideoComplete,
  onProgressUpdated,
  nextLecture,
  isLoading,
}) => {
  const shellRef = useRef(null);
  const playerRef = useRef(null);
  const lastVolumeRef = useRef(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReady = useCallback(async (player) => {
    playerRef.current = player;
    setVideoReady(true);

    try {
      const [isPaused, vol, isMuted] = await Promise.all([
        player.getPaused(),
        player.getVolume(),
        player.getMuted(),
      ]);
      setPaused(isPaused);
      const volPercent = Math.round((vol ?? 1) * 100);
      setVolume(volPercent);
      setMuted(Boolean(isMuted));
      if (!isMuted && volPercent > 0) {
        lastVolumeRef.current = volPercent;
      }
    } catch {
      setPaused(true);
    }
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

  const handleSeek = useCallback(
    (e) => {
      const player = playerRef.current;
      if (!player || !duration) return;
      const ratio = Number(e.target.value) / 100;
      const nextTime = ratio * duration;
      player.setCurrentTime(nextTime);
      setCurrentTime(nextTime);
    },
    [duration]
  );

  const toggleMute = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (muted) {
        const restore = lastVolumeRef.current > 0 ? lastVolumeRef.current : 80;
        await player.setMuted(false);
        await player.setVolume(restore / 100);
        setMuted(false);
        setVolume(restore);
      } else {
        if (volume > 0) {
          lastVolumeRef.current = volume;
        }
        await player.setMuted(true);
        setMuted(true);
      }
    } catch {
      /* ignore */
    }
  }, [muted, volume]);

  const handleVolumeChange = useCallback(async (e) => {
    const player = playerRef.current;
    if (!player) return;

    const next = Number(e.target.value);
    setVolume(next);

    try {
      if (next <= 0) {
        await player.setMuted(true);
        setMuted(true);
        return;
      }

      lastVolumeRef.current = next;
      setMuted(false);
      await player.setMuted(false);
      await player.setVolume(next / 100);
    } catch {
      /* ignore */
    }
  }, []);

  const syncFullscreen = useCallback(() => {
    const shell = shellRef.current;
    const fsEl =
      document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
    setIsFullscreen(Boolean(shell && fsEl && (fsEl === shell || shell.contains(fsEl))));
  }, []);

  const handleFullscreen = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;

    const fsEl =
      document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
    const exiting = Boolean(fsEl);

    try {
      if (exiting) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else {
          document.webkitExitFullscreen?.();
        }
        setIsFullscreen(false);
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else {
        setIsFullscreen(true);
      }
    } catch {
      setIsFullscreen(!exiting);
    }
  }, []);

  useEffect(() => {
    syncFullscreen();
    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("webkitfullscreenchange", syncFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("webkitfullscreenchange", syncFullscreen);
    };
  }, [syncFullscreen]);

  const progressValue = duration ? (currentTime / duration) * 100 : 0;
  const volumeSliderValue = muted ? 0 : volume;
  const showMutedIcon = muted || volumeSliderValue === 0;

  const prevLink = nextLecture?.previous
    ? `/courses/${courseId}/${nextLecture.previous.lecture_id}`
    : null;
  const nextLink = nextLecture?.next
    ? `/courses/${courseId}/${nextLecture.next.lecture_id}`
    : null;

  return (
    <div className="lecture-video">
      <div className="lecture-video__stage" ref={shellRef}>
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
              onProgressUpdated={onProgressUpdated}
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
                {paused ? (
                  <LecturePlayIcon size={18} />
                ) : (
                  <LecturePauseIcon size={18} />
                )}
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
              <div
                className="lecture-video__volume"
                onMouseEnter={() => setVolumeOpen(true)}
                onMouseLeave={() => setVolumeOpen(false)}
              >
                <button
                  type="button"
                  className="lecture-video__icon-btn"
                  onClick={toggleMute}
                  aria-label={showMutedIcon ? "음소거 해제" : "음소거"}
                >
                  {showMutedIcon ? <LectureVolumeMuteIcon /> : <LectureVolumeIcon />}
                </button>
                <div
                  className={`lecture-video__volume-popup${
                    volumeOpen ? " lecture-video__volume-popup--open" : ""
                  }`}
                >
                  <input
                    type="range"
                    className="lecture-video__volume-slider"
                    min={0}
                    max={100}
                    step={1}
                    value={volumeSliderValue}
                    onChange={handleVolumeChange}
                    aria-label="음량"
                    style={{ "--volume-percent": `${volumeSliderValue}%` }}
                  />
                </div>
              </div>
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
                aria-label={isFullscreen ? "전체 화면 종료" : "전체 화면"}
              >
                {isFullscreen ? <LectureCompressIcon /> : <LectureExpandIcon />}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
