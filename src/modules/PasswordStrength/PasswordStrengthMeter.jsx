import React from "react";
import PropTypes from "prop-types";
import { getPasswordStrength } from "./passwordStrengthUtils";
import "./PasswordStrengthMeter.css";

export const PasswordStrengthMeter = ({ password }) => {
  const strength = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="password-strength" aria-live="polite">
      <span className="password-strength__label">비밀번호 안전도</span>
      <span className="password-strength__level" style={{ color: strength.color }}>
        {strength.label}
      </span>
      <div className="password-strength__bars" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="password-strength__bar"
            style={{
              backgroundColor:
                index < strength.bars ? strength.color : "#d4d4d8",
            }}
          />
        ))}
      </div>
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string,
};
