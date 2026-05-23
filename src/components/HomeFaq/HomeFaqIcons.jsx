import React from "react";

export const FaqChevronIcon = ({ className = "", isOpen = false }) => (
  <svg
    className={className}
    width="13"
    height="7"
    viewBox="0 0 13 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
  >
    <path
      d="M1 1L6.5 6L12 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FaqMoreIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect
      x="0.5"
      y="0.5"
      width="19"
      height="19"
      rx="9.5"
      stroke="#1E3A6D"
    />
    <path
      d="M10.0003 5.91675V14.0834M5.91699 10.0001H14.0837"
      stroke="#1E3A6D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
