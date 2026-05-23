import React from "react";
import "./HomeEducationOperations.css";
import bannerBg from "../../images/v2/banner.png";
import { HomeEducationOperationsList } from "./HomeEducationOperationsList";
import { HOME_EDUCATION_OPERATIONS_SECTION } from "./homeEducationOperationsConfig";

export const HomeEducationOperations = () => {
  const { label, subtitle, titleLines, statusLabel } =
    HOME_EDUCATION_OPERATIONS_SECTION;

  return (
    <section
      className="home-edu-ops"
      aria-labelledby="home-edu-ops-title"
    >
      <img className="home-edu-ops__bg" src={bannerBg} alt="" aria-hidden />
      <div className="home-edu-ops__inner">
        <div className="home-edu-ops__intro">
          <p className="home-edu-ops__label">{label}</p>
          <p className="home-edu-ops__subtitle">{subtitle}</p>
          <h2 id="home-edu-ops-title" className="home-edu-ops__title">
            {titleLines.map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
        </div>

        <div className="home-edu-ops__panel">
          <HomeEducationOperationsList statusLabel={statusLabel} />
          <div className="home-edu-ops__list-fade" aria-hidden />
        </div>
      </div>
    </section>
  );
};
