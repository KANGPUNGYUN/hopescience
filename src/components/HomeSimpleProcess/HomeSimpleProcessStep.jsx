import React from "react";

export const HomeSimpleProcessStep = ({ step }) => (
  <article className="home-process__step">
    <span className="home-process__step-number" aria-hidden>
      {step.number}
    </span>
    <div className="home-process__step-content">
      <h3 className="home-process__step-title">{step.title}</h3>
      <p className="home-process__step-desc">{step.description}</p>
    </div>
  </article>
);
