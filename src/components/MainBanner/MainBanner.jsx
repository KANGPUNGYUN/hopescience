import React from "react";
import { Link } from "react-router-dom";
import "./MainBanner.css";
import mainBannerImage from "../../images/v2/main.png";
import {
  MAIN_BANNER_CONTENT,
  MAIN_BANNER_FEATURES,
} from "./mainBannerConfig";
import { BannerArrowIcon, BannerCheckIcon } from "./MainBannerIcons";

export const MainBanner = ({
  content = MAIN_BANNER_CONTENT,
  features = MAIN_BANNER_FEATURES,
  imageSrc = mainBannerImage,
}) => {
  const { badge, title, subtitle, primaryCta, secondaryCta } = content;

  return (
    <section className="main-banner" aria-labelledby="main-banner-title">
      <img
        className="main-banner__bg"
        src={imageSrc}
        alt=""
        aria-hidden
      />
      <div className="main-banner__inner">
        <p className="main-banner__badge">{badge}</p>
        <h1 id="main-banner-title" className="main-banner__title">
          {title}
        </h1>
        <p className="main-banner__subtitle">
          {subtitle.split("\n").map((line, index, lines) => (
            <React.Fragment key={index}>
              {line}
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <ul className="main-banner__features">
          {features.map((feature) => (
            <li key={feature} className="main-banner__feature">
              <BannerCheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="main-banner__actions">
          <Link to={primaryCta.to} className="main-banner__btn main-banner__btn--primary">
            <span>{primaryCta.label}</span>
            <BannerArrowIcon className="main-banner__btn-icon" />
          </Link>
          <Link
            to={secondaryCta.to}
            className="main-banner__btn main-banner__btn--secondary"
          >
            <span>{secondaryCta.label}</span>
            <BannerArrowIcon className="main-banner__btn-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};
