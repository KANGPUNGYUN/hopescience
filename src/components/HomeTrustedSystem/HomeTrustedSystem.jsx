import React from "react";
import "./HomeTrustedSystem.css";
import bannerBg from "../../images/v2/banner.png";
import {
  HOME_TRUSTED_SECTION,
  HOME_TRUSTED_STATS,
} from "./homeTrustedConfig";
import { HomeTrustedStat } from "./HomeTrustedStat";
import { useInViewOnce } from "./useInViewOnce";

export const HomeTrustedSystem = () => {
  const { ref, isInView } = useInViewOnce();
  const { label, titleLines, headline } = HOME_TRUSTED_SECTION;

  return (
    <section
      ref={ref}
      className="home-trusted"
      aria-labelledby="home-trusted-headline"
    >
      <img
        className="home-trusted__bg"
        src={bannerBg}
        alt=""
        aria-hidden
      />
      <div className="home-trusted__inner">
        <div className="home-trusted__intro">
          <p className="home-trusted__label">{label}</p>
          <h2 id="home-trusted-title" className="home-trusted__title">
            {titleLines.map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p id="home-trusted-headline" className="home-trusted__headline">
            {headline}
          </p>
        </div>

        <div className="home-trusted__stats">
          {HOME_TRUSTED_STATS.map((stat) => (
            <HomeTrustedStat
              key={stat.id}
              stat={stat}
              animateEnabled={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
