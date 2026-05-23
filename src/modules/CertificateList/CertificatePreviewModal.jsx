import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { certificate } from "../../store";
import { CertificateDocument } from "../PdfGenerator/CertificateDocument";
import {
  generateAndDownloadCertificatePDF,
} from "../PdfGenerator/certificatePdfUtils";
import { getCertificateStatus } from "./certificateListConfig";
import "./CertificatePreviewModal.css";

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
    <path
      d="M7 7L21 21M21 7L7 21"
      stroke="#222222"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const CertificatePreviewModal = ({
  certificateId,
  listItem,
  onClose,
  onIssued,
}) => {
  const certificateData = certificate((state) => state.certificate);
  const isLoading = certificate((state) => state.isLoading);
  const updateCertificate = certificate((state) => state.updateCertificate);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const status = listItem ? getCertificateStatus(listItem) : "available";
  const isCompleted = status === "completed";

  useEffect(() => {
    if (!certificateId) return undefined;

    const { getCertificate, clearCertificate } = certificate.getState();
    getCertificate(certificateId);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      clearCertificate();
    };
  }, [certificateId]);

  const handleDownload = useCallback(async () => {
    if (!certificateId || !certificateData) return;

    await generateAndDownloadCertificatePDF(certificateId);

    if (
      certificateData.user_name &&
      !certificateData.issued_date &&
      !certificateData.is_issued
    ) {
      try {
        await updateCertificate(certificateId, {
          user_name: certificateData.user_name,
          issued_date: certificateData.issued_date,
          is_issued: true,
        });
        onIssued?.();
      } catch (error) {
        console.error("수료증 발급 상태 변경 실패:", error);
      }
    }
  }, [certificateId, certificateData, updateCertificate, onIssued]);

  if (!certificateId) return null;

  const downloadLabel = isCompleted ? "PDF 다운로드" : "수료증 발급";

  return createPortal(
    <div
      className="cert-preview-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-preview-modal-title"
    >
      <button
        type="button"
        className="cert-preview-modal__backdrop"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="cert-preview-modal__panel">
        <header className="cert-preview-modal__header">
          <h2 id="cert-preview-modal-title" className="cert-preview-modal__title">
            수료증
          </h2>
          <button
            type="button"
            className="cert-preview-modal__close"
            aria-label="닫기"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        <div className="cert-preview-modal__body">
          {isLoading && !certificateData ? (
            <p className="cert-preview-modal__loading">불러오는 중...</p>
          ) : certificateData ? (
            <div className="cert-preview-modal__preview">
              <CertificateDocument
                certificateData={certificateData}
                certificateId={certificateId}
              />
            </div>
          ) : (
            <p className="cert-preview-modal__loading">
              수료증 정보를 불러오지 못했습니다.
            </p>
          )}
        </div>

        <footer className="cert-preview-modal__footer">
          <button
            type="button"
            className="cert-preview-modal__btn cert-preview-modal__btn--secondary"
            onClick={onClose}
          >
            닫기
          </button>
          <button
            type="button"
            className="cert-preview-modal__btn cert-preview-modal__btn--primary"
            onClick={handleDownload}
            disabled={!certificateData || isLoading}
          >
            {downloadLabel}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};
