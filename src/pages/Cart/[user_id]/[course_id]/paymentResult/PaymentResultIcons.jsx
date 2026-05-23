import React from "react";

export const PaymentSuccessIcon = () => (
  <svg
    className="payment-result-card__icon"
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle cx="32" cy="32" r="30" stroke="#1e3a6d" strokeWidth="2" />
    <path
      d="M20 32.5L28.5 41L44 25"
      stroke="#1e3a6d"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PaymentFailIcon = () => (
  <svg
    className="payment-result-card__icon payment-result-card__icon--fail"
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle cx="32" cy="32" r="30" stroke="#c94a4a" strokeWidth="2" />
    <path
      d="M24 24L40 40M40 24L24 40"
      stroke="#c94a4a"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
