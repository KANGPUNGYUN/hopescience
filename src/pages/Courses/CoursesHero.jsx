import React from "react";
import heroImage from "../../images/v2/banner07.png";
import { COURSES_HERO } from "./coursesConfig";

export const CoursesHero = () => {
  const { label, title, subtitle } = COURSES_HERO;

  return (
    <section className="courses-hero" aria-labelledby="courses-hero-title">
      <img className="courses-hero__bg" src={heroImage} alt="" aria-hidden />
      <div className="courses-hero__overlay" aria-hidden />
      <div className="courses-hero__inner">
        <p className="courses-hero__label">{label}</p>
        <h1 id="courses-hero-title" className="courses-hero__title">
          {title.split("\n").map((line, index, lines) => (
            <React.Fragment key={index}>
              {line}
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <p className="courses-hero__subtitle">{subtitle}</p>
      </div>
    </section>
  );
};
