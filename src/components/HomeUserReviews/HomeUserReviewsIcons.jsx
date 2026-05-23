import React from "react";

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
};

export const ReviewsChevronLeftIcon = () => (
  <svg {...iconProps}>
    <path
      d="M14 6L8 12L14 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReviewsChevronRightIcon = () => (
  <svg {...iconProps}>
    <path
      d="M10 6L16 12L10 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReviewsPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 5V19M5 12H19"
      stroke="#1e3a6d"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
