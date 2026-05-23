import React from "react";
import { Link } from "react-router-dom";
import "./HomeCtaBanner.css";
import footerBg from "../../images/v2/footer-bg.png";
import { HOME_CTA_BANNER } from "./homeCtaBannerConfig";
import { CtaBannerChevronIcon } from "./HomeCtaBannerIcons";

export const HomeCtaBanner = ({ content = HOME_CTA_BANNER }) => {
  const { title, subtitle, cta } = content;

  return (
    <section className="home-cta-banner" aria-labelledby="home-cta-banner-title">
      <img className="home-cta-banner__bg" src={footerBg} alt="" aria-hidden />
      <div className="home-cta-banner__inner">
        <h2 id="home-cta-banner-title" className="home-cta-banner__title">
          {title}
        </h2>
        <p className="home-cta-banner__subtitle">{subtitle}</p>
        <Link to={cta.to} className="home-cta-banner__btn">
          <span>{cta.label}</span>
          <CtaBannerChevronIcon className="home-cta-banner__btn-icon" />
        </Link>
      </div>
    </section>
  );
};
