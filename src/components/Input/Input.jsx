import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import "./Input.css";
import { PasswordHideIcon, PasswordShowIcon } from "./PasswordVisibilityIcons";

export const Input = forwardRef(
  (
    { type, placeholder, onChange, value, mode, style, error, className, onKeyDown },
    ref
  ) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = (e) => {
      e.preventDefault();
      setPasswordVisible((prevVisible) => !prevVisible);
    };

    const inputType =
      type === "password" ? (passwordVisible ? "text" : "password") : type;

    return (
      <div className={`input-container`}>
        <input
          ref={ref}
          type={inputType}
          className={`input input--${mode} ${className}`}
          style={{ ...style }}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          onKeyDown={onKeyDown}
        />
        {type === "password" && (
          <button
            type="button"
            className="toggle-password-button"
            onClick={togglePasswordVisibility}
            aria-label={passwordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {passwordVisible ? <PasswordHideIcon /> : <PasswordShowIcon />}
          </button>
        )}
        {error && <p className="input-error-message">{error}</p>}
      </div>
    );
  }
);

Input.propTypes = {
  type: PropTypes.oneOf(["name", "text", "password", "email", "tel"]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  mode: PropTypes.oneOf(["default", "dark", "underline"]),
};

Input.defaultProps = {
  type: "text",
  placeholder: "",
  onChange: () => {},
  onKeyDown: () => {},
  mode: "default",
};
