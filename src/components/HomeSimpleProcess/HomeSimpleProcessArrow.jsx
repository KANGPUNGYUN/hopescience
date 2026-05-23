import React from "react";

export const HomeSimpleProcessArrow = ({ className = "" }) => (
  <span className={`home-process__arrow ${className}`.trim()} aria-hidden>
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M38.0756 27.1891C38.6287 27.5882 38.6287 28.4117 38.0756 28.8109L23.9844 38.9803C23.3231 39.4576 22.3992 38.9851 22.3992 38.1694L22.3992 17.8306C22.3992 17.0149 23.3231 16.5424 23.9844 17.0197L38.0756 27.1891Z"
        fill="#222222"
        fillOpacity="0.16"
      />
    </svg>
  </span>
);
