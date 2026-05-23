import React from "react";
import { WhyFeatureIcon } from "./HomeWhyIcons";

export const HomeWhyCard = ({ feature }) => (
  <article className="home-why__card">
    <span className="home-why__card-number">{feature.number}</span>
    <div className="home-why__card-body">
      <div className="home-why__card-text">
        <h3 className="home-why__card-title">{feature.title}</h3>
        <p className="home-why__card-desc">{feature.description}</p>
      </div>
      <div className="home-why__card-icon" aria-hidden>
        <WhyFeatureIcon name={feature.icon} />
      </div>
    </div>
  </article>
);
