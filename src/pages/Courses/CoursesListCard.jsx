import React from "react";
import { Link } from "react-router-dom";
import mainImage from "../../images/main.png";
import {
  COURSE_CARD_META,
  formatCoursePrice,
  getCourseTags,
} from "./coursesConfig";

export const CoursesListCard = ({ course }) => {
  const tags = getCourseTags(course);
  const showOriginalPrice =
    typeof course.price === "number" &&
    typeof course.discounted_price === "number" &&
    course.discounted_price < course.price;

  return (
    <article className="courses-card">
      <Link
        to={`/courses/${course.id}`}
        className="courses-card__link"
        aria-label={`${course.title} 강의 상세 보기`}
      >
        <div className="courses-card__media">
          <img
            className="courses-card__image"
            src={course.thumbnail || mainImage}
            alt=""
            loading="lazy"
          />
        </div>
        <div className="courses-card__body">
          <h2 className="courses-card__title">{course.title}</h2>
          <p className="courses-card__meta">{COURSE_CARD_META}</p>
          <div className="courses-card__prices">
            {showOriginalPrice && (
              <span className="courses-card__price courses-card__price--original">
                {formatCoursePrice(course.price)}
              </span>
            )}
            <span className="courses-card__price courses-card__price--sale">
              {formatCoursePrice(course.discounted_price ?? course.price)}
            </span>
          </div>
          {tags.length > 0 && (
            <ul className="courses-card__tags" aria-label="과정 안내">
              {tags.map((tag) => (
                <li
                  key={tag.label}
                  className={`courses-card__tag courses-card__tag--${tag.variant}`}
                >
                  {tag.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
};
