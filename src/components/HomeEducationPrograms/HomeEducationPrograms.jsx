import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomeEducationPrograms.css";
import { HOME_EDUCATION_SECTION } from "./homeEducationConfig";
import { EducationMoreIcon } from "./HomeEducationIcons";
import { HomeEducationCard } from "./HomeEducationCard";
import { useLatestCourses } from "./useLatestCourses";

export const HomeEducationPrograms = () => {
  const { courses, loading } = useLatestCourses(3);
  const [activeIndex, setActiveIndex] = useState(0);

  const { label, title, subtitle, moreLink } = HOME_EDUCATION_SECTION;

  return (
    <section className="home-education" aria-labelledby="home-education-title">
      <div className="home-education__inner">
        <header className="home-education__header">
          <div className="home-education__header-text">
            <p className="home-education__label">{label}</p>
            <h2 id="home-education-title" className="home-education__title">
              {title.split("\n").map((line, index, lines) => (
                <React.Fragment key={index}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p className="home-education__subtitle">{subtitle}</p>
          </div>
          <Link to={moreLink.to} className="home-education__more">
            <span>{moreLink.label}</span>
            <span className="home-education__more-icon" aria-hidden>
              <EducationMoreIcon />
            </span>
          </Link>
        </header>

        <div
          className={`home-education__gallery${loading ? " home-education__gallery--loading" : ""}`}
          onMouseLeave={() => setActiveIndex(0)}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`home-education__card home-education__card--skeleton${
                    index === 0 ? " home-education__card--active" : ""
                  }`}
                  aria-hidden
                />
              ))
            : courses.map((course, index) => (
                <HomeEducationCard
                  key={course.id}
                  course={course}
                  isActive={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
        </div>
      </div>
    </section>
  );
};
