import React from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../../components";
import { NotFoundWarningIcon } from "./NotFoundWarningIcon";
import { NOT_FOUND_CONTENT } from "./notFoundConfig";
import "./NotFound.css";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const title = `${NOT_FOUND_CONTENT.titleLine1}\n${NOT_FOUND_CONTENT.titleLine2}`;

  return (
    <div className="not-found-shell">
      <Header variant="light" />
      <main className="not-found-page">
        <div className="not-found-page__inner">
          <NotFoundWarningIcon />
          <h1 className="not-found-page__title">{title}</h1>
          <p className="not-found-page__description">
            {NOT_FOUND_CONTENT.description}
          </p>
          <button
            type="button"
            className="not-found-page__back-btn"
            onClick={handleGoBack}
          >
            {NOT_FOUND_CONTENT.backButtonLabel}
          </button>
        </div>
      </main>
      <Footer variant="light" />
    </div>
  );
};
