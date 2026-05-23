import React from "react";
import "./HomeWhyHopeScience.css";
import { HOME_WHY_FEATURES, HOME_WHY_SECTION } from "./homeWhyConfig";
import { HomeWhyCard } from "./HomeWhyCard";

export const HomeWhyHopeScience = () => {
  const { label, title, subtitle, watermark } = HOME_WHY_SECTION;

  return (
    <section className="home-why" aria-labelledby="home-why-title">
      <div className="home-why__inner">
        <header className="home-why__header">
          <p className="home-why__label">{label}</p>
          <h2 id="home-why-title" className="home-why__title">
            {title}
          </h2>
          <p className="home-why__subtitle">{subtitle}</p>
        </header>

        <div className="home-why__cards">
          {HOME_WHY_FEATURES.map((feature) => (
            <HomeWhyCard key={feature.id} feature={feature} />
          ))}
        </div>

        <p className="home-why__watermark" aria-hidden>
          {watermark}
        </p>
      </div>
    </section>
  );
};
