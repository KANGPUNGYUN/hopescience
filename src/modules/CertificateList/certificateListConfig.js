export const CERTIFICATE_TABS = [
  { key: "all", label: "전체" },
  { key: "available", label: "발급 가능" },
  { key: "completed", label: "발급 완료" },
];

export function formatCertificateDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function getCertificateStatus(certificate) {
  const issued = Boolean(
    certificate?.issued_date || certificate?.is_issued
  );
  return issued ? "completed" : "available";
}

export function getValidityLabel(certificate) {
  const expiry =
    certificate?.valid_until ||
    certificate?.expiry_date ||
    certificate?.validity_end;

  if (!expiry) return "무제한";

  const formatted = formatCertificateDate(expiry);
  return formatted ? `유효기간 : ${formatted}` : "무제한";
}

export function getCompletionDateLabel(certificate) {
  return (
    formatCertificateDate(
      certificate?.education_completed_at ||
        certificate?.course_completed_at ||
        certificate?.completed_at ||
        certificate?.completion_date
    ) || "-"
  );
}

export function getIssuedDateLabel(certificate) {
  if (getCertificateStatus(certificate) === "available") return "-";
  return formatCertificateDate(certificate?.issued_date) || "-";
}

export function filterCertificatesByTab(certificates, tabKey) {
  if (tabKey === "available") {
    return certificates.filter((item) => getCertificateStatus(item) === "available");
  }
  if (tabKey === "completed") {
    return certificates.filter((item) => getCertificateStatus(item) === "completed");
  }
  return certificates;
}
