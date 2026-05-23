import React from "react";
import heroImage from "../../images/v2/banner08.png";
import { FAQ_PAGE_HERO } from "./faqPageConfig";

export const FaqHero = () => {
  const { label, title, description } = FAQ_PAGE_HERO;

  return (
    <section className="faq-page-hero" aria-labelledby="faq-page-hero-title">
      <img className="faq-page-hero__bg" src={heroImage} alt="" aria-hidden />
      <div className="faq-page-hero__overlay" aria-hidden />
      <div className="faq-page-hero__inner">
        <p className="faq-page-hero__label">{label}</p>
        <h1 id="faq-page-hero-title" className="faq-page-hero__title">
          {title}
        </h1>
        <p className="faq-page-hero__desc">
          {description.split("\n").map((line, index, lines) => (
            <React.Fragment key={index}>
              {line}
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>
    </section>
  );
};
