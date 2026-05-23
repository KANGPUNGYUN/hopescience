import React from "react";

/** 잠금 (미구매 강의) — Pencil curriculum row */
export const CourseLockIcon = ({ className = "", size = 16 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M2.66699 9.86667C2.66699 8.74656 2.66699 8.18651 2.88498 7.75869C3.07673 7.38236 3.38269 7.0764 3.75901 6.88465C4.18683 6.66667 4.74689 6.66667 5.86699 6.66667H10.1337C11.2538 6.66667 11.8138 6.66667 12.2416 6.88465C12.618 7.0764 12.9239 7.38236 13.1157 7.75869C13.3337 8.18651 13.3337 8.74656 13.3337 9.86667V10.8C13.3337 11.9201 13.3337 12.4802 13.1157 12.908C12.9239 13.2843 12.618 13.5903 12.2416 13.782C11.8138 14 11.2538 14 10.1337 14H5.86699C4.74689 14 4.18683 14 3.75901 13.782C3.38269 13.5903 3.07673 13.2843 2.88498 12.908C2.66699 12.4802 2.66699 11.9201 2.66699 10.8V9.86667Z"
      fill="#767676"
    />
    <path
      d="M11.3337 6.66667V5.33333C11.3337 3.49238 9.84127 2 8.00033 2C6.15938 2 4.66699 3.49238 4.66699 5.33333V6.66667M5.86699 14H10.1337C11.2538 14 11.8138 14 12.2416 13.782C12.618 13.5903 12.9239 13.2843 13.1157 12.908C13.3337 12.4802 13.3337 11.9201 13.3337 10.8V9.86667C13.3337 8.74656 13.3337 8.18651 13.1157 7.75869C12.9239 7.38236 12.618 7.0764 12.2416 6.88465C11.8138 6.66667 11.2538 6.66667 10.1337 6.66667H5.86699C4.74689 6.66667 4.18683 6.66667 3.75901 6.88465C3.38269 7.0764 3.07673 7.38236 2.88498 7.75869C2.66699 8.18651 2.66699 8.74656 2.66699 9.86667V10.8C2.66699 11.9201 2.66699 12.4802 2.88498 12.908C3.07673 13.2843 3.38269 13.5903 3.75901 13.782C4.18683 14 4.74689 14 5.86699 14Z"
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 9.66675V11.0001"
      stroke="#0B1321"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 조회수 — Pencil Q&A row */
export const CourseViewIcon = ({ className = "", size = 16 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M1.61342 8.47537C1.52262 8.33161 1.47723 8.25973 1.45182 8.14886C1.43273 8.06558 1.43273 7.93425 1.45182 7.85097C1.47723 7.74011 1.52262 7.66823 1.61341 7.52447C2.36369 6.33648 4.59693 3.33325 8.00027 3.33325C11.4036 3.33325 13.6369 6.33648 14.3871 7.52447C14.4779 7.66823 14.5233 7.74011 14.5487 7.85097C14.5678 7.93425 14.5678 8.06558 14.5487 8.14886C14.5233 8.25973 14.4779 8.33161 14.3871 8.47537C13.6369 9.66336 11.4036 12.6666 8.00027 12.6666C4.59693 12.6666 2.36369 9.66336 1.61342 8.47537Z"
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00027 9.99992C9.10484 9.99992 10.0003 9.10449 10.0003 7.99992C10.0003 6.89535 9.10484 5.99992 8.00027 5.99992C6.8957 5.99992 6.00027 6.89535 6.00027 7.99992C6.00027 9.10449 6.8957 9.99992 8.00027 9.99992Z"
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 댓글 — Pencil Q&A row */
export const CourseCommentIcon = ({ className = "", size = 16 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M5 8H5.00667M8 8H8.00667M11 8H11.0067M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 8.7981 2.15582 9.5598 2.43871 10.2563C2.49285 10.3897 2.51992 10.4563 2.532 10.5102C2.54381 10.5629 2.54813 10.6019 2.54814 10.6559C2.54814 10.7111 2.53812 10.7713 2.51807 10.8916L2.12275 13.2635C2.08135 13.5119 2.06065 13.6361 2.09917 13.7259C2.13289 13.8045 2.19552 13.8671 2.27412 13.9008C2.36393 13.9393 2.48812 13.9186 2.73651 13.8772L5.10843 13.4819C5.22872 13.4619 5.28887 13.4519 5.34409 13.4519C5.3981 13.4519 5.43711 13.4562 5.48981 13.468C5.54369 13.4801 5.61035 13.5072 5.74366 13.5613C6.4402 13.8442 7.2019 14 8 14ZM5.33333 8C5.33333 8.18409 5.18409 8.33333 5 8.33333C4.81591 8.33333 4.66667 8.18409 4.66667 8C4.66667 7.81591 4.81591 7.66667 5 7.66667C5.18409 7.66667 5.33333 7.81591 5.33333 8ZM8.33333 8C8.33333 8.18409 8.18409 8.33333 8 8.33333C7.81591 8.33333 7.66667 8.18409 7.66667 8C7.66667 7.81591 7.81591 7.66667 8 7.66667C8.18409 7.66667 8.33333 7.81591 8.33333 8ZM11.3333 8C11.3333 8.18409 11.1841 8.33333 11 8.33333C10.8159 8.33333 10.6667 8.18409 10.6667 8C10.6667 7.81591 10.8159 7.66667 11 7.66667C11.1841 7.66667 11.3333 7.81591 11.3333 8Z"
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CoursePlaySmallIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M7.5 5L14 10L7.5 15V5Z" fill="#ffffff" />
  </svg>
);

export const CoursePlayCircleIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <g clipPath="url(#course_detail_play_clip)">
      <path
        d="M7.99967 14.6666C11.6816 14.6666 14.6663 11.6818 14.6663 7.99992C14.6663 4.31802 11.6816 1.33325 7.99967 1.33325C4.31778 1.33325 1.33301 4.31802 1.33301 7.99992C1.33301 11.6818 4.31778 14.6666 7.99967 14.6666Z"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.33301 5.97691C6.33301 5.65872 6.33301 5.49962 6.3995 5.4108C6.45745 5.3334 6.54615 5.28498 6.64259 5.27809C6.75326 5.27018 6.88709 5.35621 7.15475 5.52828L10.3018 7.55139C10.5341 7.7007 10.6502 7.77535 10.6903 7.87028C10.7253 7.95322 10.7253 8.04682 10.6903 8.12976C10.6502 8.22468 10.5341 8.29934 10.3018 8.44865L7.15475 10.4718C6.88709 10.6438 6.75326 10.7299 6.64259 10.722C6.54615 10.7151 6.45745 10.6666 6.3995 10.5892C6.33301 10.5004 6.33301 10.3413 6.33301 10.0231V5.97691Z"
        fill="#999999"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="course_detail_play_clip">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const CourseChevronUpIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M5 12.5L10 7.5L15 12.5"
      stroke="#222222"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CourseChevronDownIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="#222222"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CourseChevronDownSmallIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M4.5 7.5L9 12L13.5 7.5"
      stroke="#222222"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
