import React from "react";
import heroImage from "../../../images/v2/banner08.png";
import { QNA_DETAIL_HERO } from "./qnaDetailConfig";

export const QnADetailHero = () => {
  const { label, title, description } = QNA_DETAIL_HERO;

  return (
    <section className="qna-detail-hero" aria-labelledby="qna-detail-hero-title">
      <img className="qna-detail-hero__bg" src={heroImage} alt="" aria-hidden />
      <div className="qna-detail-hero__overlay" aria-hidden />
      <div className="qna-detail-hero__inner">
        <p className="qna-detail-hero__label">{label}</p>
        <h1 id="qna-detail-hero-title" className="qna-detail-hero__title">
          {title}
        </h1>
        <p className="qna-detail-hero__desc">
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
