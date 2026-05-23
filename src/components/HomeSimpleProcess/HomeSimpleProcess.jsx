import React from "react";
import "./HomeSimpleProcess.css";
import { HomeSimpleProcessArrow } from "./HomeSimpleProcessArrow";
import { HomeSimpleProcessStep } from "./HomeSimpleProcessStep";
import {
  HOME_SIMPLE_PROCESS_SECTION,
  HOME_SIMPLE_PROCESS_STEPS,
} from "./homeSimpleProcessConfig";

export const HomeSimpleProcess = () => {
  const { label, title, description } = HOME_SIMPLE_PROCESS_SECTION;

  return (
    <section
      className="home-process"
      aria-labelledby="home-process-title"
    >
      <div className="home-process__inner">
        <header className="home-process__header">
          <p className="home-process__label">{label}</p>
          <h2 id="home-process-title" className="home-process__title">
            {title}
          </h2>
          <p className="home-process__desc">{description}</p>
        </header>

        <div className="home-process__steps">
          {HOME_SIMPLE_PROCESS_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`home-process__group${
                index === HOME_SIMPLE_PROCESS_STEPS.length - 1
                  ? " home-process__group--last"
                  : ""
              }`}
            >
              <HomeSimpleProcessStep step={step} />
              {index < HOME_SIMPLE_PROCESS_STEPS.length - 1 && (
                <HomeSimpleProcessArrow />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
