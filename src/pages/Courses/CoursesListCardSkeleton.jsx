import React from "react";

export const CoursesListCardSkeleton = () => (
  <article className="courses-card courses-card--skeleton" aria-hidden>
    <div className="courses-card__media courses-card__media--skeleton" />
    <div className="courses-card__body">
      <div className="courses-card__line courses-card__line--title" />
      <div className="courses-card__line courses-card__line--meta" />
      <div className="courses-card__line courses-card__line--price" />
      <div className="courses-card__tags-skeleton">
        <span />
        <span />
      </div>
    </div>
  </article>
);
