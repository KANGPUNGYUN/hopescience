import React from "react";
import PropTypes from "prop-types";
import { Header, Footer } from "../../components";
import "./authShared.css";

export const AuthPageLayout = ({ title, subtitle, children }) => (
  <>
    <Header variant="light" />
    <main className="auth-page">
      <div className="auth-page__inner">
        <div className="auth-page__card">
          <header className="auth-page__header">
            <h1 className="auth-page__title">{title}</h1>
            {subtitle ? (
              <p className="auth-page__subtitle">{subtitle}</p>
            ) : null}
          </header>
          {children}
        </div>
      </div>
    </main>
    <Footer variant="light" />
  </>
);

AuthPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};
