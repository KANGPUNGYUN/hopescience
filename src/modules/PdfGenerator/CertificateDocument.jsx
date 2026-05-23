import React from "react";
import stampImage from "../../images/stamp.png";
import { formatCertificateDateKorean } from "./certificatePdfUtils";
import "./PdfGenerator.css";

export const CertificateDocument = ({ certificateData, certificateId }) => {
  const completionDate = formatCertificateDateKorean(
    certificateData?.completion_date ?? certificateData?.completed_at
  );

  return (
    <div className="certificate" id={`certificate-${certificateId}`}>
      <div className="certificate-pdf-content">
        <p className="certificate-pdf-id">발급번호: {certificateData?.certificate_id}</p>
        <h1 className="certificate-pdf-title">수 료 증 서</h1>
        <h2 className="certificate-pdf-title-eng">Certificate of completion</h2>
        <div className="certificate-pdf-data">
          <div className="certificate-pdf-data-index">성 명:</div>
          <div>{certificateData?.user_name}</div>
        </div>
        <div className="certificate-pdf-data">
          <div className="certificate-pdf-data-index">교 육 과 정:</div>
          <div>{certificateData?.course_name}</div>
        </div>
        <div className="certificate-pdf-data">
          <div className="certificate-pdf-data-index">수 료 일:</div>
          <div>{completionDate}</div>
        </div>
        <div className="certificate-pdf-desc">
          &nbsp;&nbsp;&nbsp;상기 사람은 본 센터에서 실시한 위 소정의 교육과정 전 과목을
          성실히 이수하고 해당 교과 시험을 합격하여 성료하였으므로 본 증서를 정히
          수여합니다.
        </div>
      </div>
      <div className="certificate-pdf-company">
        <div className="certificate-pdf-company-name">
          희망과학심리상담센터장 이 현 호
        </div>
        <img src={stampImage} alt="희망과학심리센터장 도장" width="100" height="100" />
      </div>
    </div>
  );
};
