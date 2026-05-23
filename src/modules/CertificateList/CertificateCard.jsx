import React from "react";
import { MyPageCalendarIcon, MyPageClockIcon } from "../MyPageMetaIcons";
import {
  getCertificateStatus,
  getCompletionDateLabel,
  getIssuedDateLabel,
  getValidityLabel,
} from "./certificateListConfig";

export const CertificateCard = ({ certificate, onPreview }) => {
  const status = getCertificateStatus(certificate);
  const isCompleted = status === "completed";
  const certificateId = certificate.certificate_id;

  return (
    <article className="mypage-certificate-card">
      <div className="mypage-certificate-card__top">
        <span
          className={`mypage-certificate-card__badge${
            isCompleted
              ? " mypage-certificate-card__badge--done"
              : " mypage-certificate-card__badge--available"
          }`}
        >
          {isCompleted ? "발급 완료" : "발급 가능"}
        </span>
        <span className="mypage-certificate-card__validity">
          {getValidityLabel(certificate)}
        </span>
      </div>

      <h3 className="mypage-certificate-card__title">{certificate.course_name}</h3>

      <div className="mypage-certificate-card__meta">
        <div className="mypage-certificate-card__meta-col">
          <span className="mypage-certificate-card__meta-label">
            <span className="mypage-certificate-card__meta-icon" aria-hidden>
              <MyPageCalendarIcon />
            </span>
            교육 수료일
          </span>
          <span className="mypage-certificate-card__meta-value">
            {getCompletionDateLabel(certificate)}
          </span>
        </div>
        <div className="mypage-certificate-card__meta-col">
          <span className="mypage-certificate-card__meta-label">
            <span className="mypage-certificate-card__meta-icon" aria-hidden>
              <MyPageClockIcon />
            </span>
            수료증 발급일
          </span>
          <span className="mypage-certificate-card__meta-value">
            {getIssuedDateLabel(certificate)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className={`mypage-certificate-card__btn${
          isCompleted
            ? " mypage-certificate-card__btn--download"
            : " mypage-certificate-card__btn--issue"
        }`}
        onClick={() => onPreview?.(certificateId, certificate)}
      >
        {isCompleted ? "수료증 다운로드 (PDF)" : "수료증 발급"}
      </button>
    </article>
  );
};
