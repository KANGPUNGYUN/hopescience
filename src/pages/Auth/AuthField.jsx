import React from "react";
import PropTypes from "prop-types";

export const AuthField = ({ label, htmlFor, error, children }) => (
  <div className="auth-field">
    {label ? (
      <label htmlFor={htmlFor} className="auth-field__label">
        {label}
      </label>
    ) : null}
    {children}
    {error ? <p className="input-error-message">{error}</p> : null}
  </div>
);

AuthField.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};
