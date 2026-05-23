import React from "react";

/** 12-bar radial loader (design spec) */
export const PageLoadingSpinner = () => (
  <svg
    className="page-loading__spinner-svg"
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect x="38.333" width="3.33333" height="20" rx="1.66667" fill="#C4C4C4" />
    <rect
      y="41.666"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(-90 0 41.666)"
      fill="black"
    />
    <rect
      x="21.4434"
      y="75.4746"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(-150 21.4434 75.4746)"
      fill="#2B2B2B"
    />
    <rect
      x="61.4434"
      y="73.8086"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(150 61.4434 73.8086)"
      fill="#575757"
    />
    <rect
      x="75.4746"
      y="58.5566"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(120 75.4746 58.5566)"
      fill="#6D6D6D"
    />
    <rect
      x="73.8076"
      y="18.5566"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(60 73.8076 18.5566)"
      fill="#989898"
    />
    <rect
      x="41.667"
      y="80"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(180 41.667 80)"
      fill="#414141"
    />
    <rect
      x="80"
      y="38.334"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(90 80 38.334)"
      fill="#828282"
    />
    <rect
      x="58.5566"
      y="4.52539"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(30 58.5566 4.52539)"
      fill="#AEAEAE"
    />
    <rect
      x="18.5566"
      y="6.19141"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(-30 18.5566 6.19141)"
      fill="#D9D9D9"
    />
    <rect
      x="4.52539"
      y="21.4434"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(-60 4.52539 21.4434)"
      fill="#EFEFEF"
    />
    <rect
      x="6.19238"
      y="61.4434"
      width="3.33333"
      height="20"
      rx="1.66667"
      transform="rotate(-120 6.19238 61.4434)"
      fill="#161616"
    />
  </svg>
);
