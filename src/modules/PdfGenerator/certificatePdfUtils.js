import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const formatCertificateDateKorean = (dateInput) => {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(date.getTime())) {
    const today = new Date();
    return `${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, "0")}월 ${String(today.getDate()).padStart(2, "0")}일`;
  }
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
};

export const generateAndDownloadCertificatePDF = async (certificateId) => {
  const input = document.getElementById(`certificate-${certificateId}`);
  if (!input) return;

  const pdfDPI = 300;
  const scale = pdfDPI / 96;
  const canvas = await html2canvas(input, {
    scale,
    useCORS: true,
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: input.scrollWidth,
    windowHeight: input.scrollHeight,
  });

  const pdfWidth = (210 * pdfDPI) / 25.4;
  const pdfHeight = (297 * pdfDPI) / 25.4;

  const pdf = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: [pdfWidth, pdfHeight],
  });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("이수증서.pdf");
};
