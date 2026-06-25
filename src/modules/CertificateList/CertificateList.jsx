import React, { useCallback, useEffect, useMemo, useState } from "react";
import { certificate } from "../../store";
import { CertificateCard } from "./CertificateCard";
import { CertificatePreviewModal } from "./CertificatePreviewModal";
import { CertificatesEmpty } from "./CertificatesEmpty";
import {
  CERTIFICATE_TABS,
  filterCertificatesByTab,
} from "./certificateListConfig";
import "./CertificateList.css";

export const CertificateList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [previewTarget, setPreviewTarget] = useState(null);

  const getCertificatesByUser = certificate((state) => state.getCertificatesByUser);
  const clearCertificates = certificate((state) => state.clearCertificates);
  const certificates = certificate((state) => state.certificates);
  const isLoading = certificate((state) => state.isLoading);

  const myUserId = useMemo(() => {
    const data = localStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  useEffect(() => {
    if (!myUserId) return;
    clearCertificates();
    getCertificatesByUser(myUserId);
  }, [myUserId, clearCertificates, getCertificatesByUser]);

  const visibleCertificates = useMemo(
    () => filterCertificatesByTab(certificates ?? [], activeTab),
    [certificates, activeTab]
  );

  const hasAnyCertificate = (certificates?.length ?? 0) > 0;

  const handleOpenPreview = useCallback((certificateId, listItem) => {
    setPreviewTarget({ certificateId, listItem });
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewTarget(null);
  }, []);

  const handleCertificateIssued = useCallback(() => {
    if (!myUserId) return;
    clearCertificates();
    getCertificatesByUser(myUserId);
  }, [myUserId, clearCertificates, getCertificatesByUser]);

  return (
    <div className="mypage-certificates">
      {hasAnyCertificate && (
        <>
          <div
            className="mypage-certificates__tabs"
            role="tablist"
            aria-label="수료증 필터"
          >
            {CERTIFICATE_TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                className={`mypage-certificates__tab${
                  activeTab === key ? " mypage-certificates__tab--active" : ""
                }`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="mypage-certificates__loading">불러오는 중...</p>
          ) : visibleCertificates.length === 0 ? (
            <p className="mypage-certificates__empty-tab">
              해당 조건의 수료증이 없습니다.
            </p>
          ) : (
            <ul className="mypage-certificates__grid">
              {visibleCertificates.map((item) => (
                <li key={item.id ?? item.certificate_id}>
                  <CertificateCard
                    certificate={item}
                    onPreview={handleOpenPreview}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {!isLoading && !hasAnyCertificate && <CertificatesEmpty />}
      {isLoading && !hasAnyCertificate && (
        <p className="mypage-certificates__loading">불러오는 중...</p>
      )}

      {previewTarget && (
        <CertificatePreviewModal
          certificateId={previewTarget.certificateId}
          listItem={previewTarget.listItem}
          onClose={handleClosePreview}
          onIssued={handleCertificateIssued}
        />
      )}
    </div>
  );
};
