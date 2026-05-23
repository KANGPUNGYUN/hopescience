import React from "react";
import heroImage from "../../images/v2/banner08.png";
import { QNA_BOARD_HERO } from "./qnaBoardConfig";

export const QnAHero = () => {
  const { label, title, description } = QNA_BOARD_HERO;

  return (
    <section className="qna-board-hero" aria-labelledby="qna-board-hero-title">
      <img className="qna-board-hero__bg" src={heroImage} alt="" aria-hidden />
      <div className="qna-board-hero__overlay" aria-hidden />
      <div className="qna-board-hero__inner">
        <p className="qna-board-hero__label">{label}</p>
        <h1 id="qna-board-hero-title" className="qna-board-hero__title">
          {title}
        </h1>
        <p className="qna-board-hero__desc">
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
