import React from "react";
import { Link } from "react-router-dom";
import { EducationPlayIcon } from "./HomeEducationIcons";
import { getVimeoEmbedUrl } from "./useLatestCourses";

export const HomeEducationCard = ({
  course,
  isActive,
  onMouseEnter,
}) => {
  const embedUrl = isActive ? getVimeoEmbedUrl(course.videoUrl) : null;
  const showDescription = isActive && course.description;
  const coursePath = String(course.id).startsWith("fallback")
    ? "/courses"
    : `/courses/${course.id}`;

  return (
    <article
      className={`home-education__card${isActive ? " home-education__card--active" : ""}`}
      onMouseEnter={onMouseEnter}
    >
      <Link
        to={coursePath}
        className="home-education__card-link"
        aria-label={`${course.title} 강의 상세 보기`}
      >
        <div className="home-education__media">
          {course.thumbnail && (
            <img
              className="home-education__poster"
              src={course.thumbnail}
              alt=""
              loading="lazy"
            />
          )}
          {embedUrl && (
            <iframe
              className="home-education__video"
              src={embedUrl}
              title={`${course.title} 미리보기`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
          <div className="home-education__overlay" aria-hidden />
          {isActive && course.videoUrl && (
            <div className="home-education__play" aria-hidden>
              <EducationPlayIcon />
            </div>
          )}
        </div>
        {isActive && (
          <div className="home-education__caption">
            <h3 className="home-education__card-title">{course.title}</h3>
            {showDescription && (
              <p className="home-education__card-desc">{course.description}</p>
            )}
          </div>
        )}
      </Link>
    </article>
  );
};
