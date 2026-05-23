import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../../../components";
import { QnAHero } from "../QnAHero";
import { QnAWriteForm } from "./QnAWriteForm";
import { EducationReviewComingSoonModal } from "../EducationReviewComingSoonModal";
import { useEducationReviewComingSoon } from "../useEducationReviewComingSoon";
import { reviewBoardRoutes } from "../qnaBoardConfig";
import "./style.css";

export const QnAWritePage = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const { isApiEnabled, isComingSoonOpen, closeComingSoon } =
    useEducationReviewComingSoon();

  const mobileTitle = mode === "edit" ? "고객 후기 수정" : "고객 후기 작성";

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      <div className="qna-write-page-shell">
        <Header
          variant={isMobile ? "solid" : "dark"}
          mobileTitle={isMobile ? mobileTitle : undefined}
          onMobileClose={isMobile ? () => navigate(reviewBoardRoutes.list) : undefined}
        />

        <main className="qna-write-page">
          <QnAHero />

          <section className="qna-write-page__content" aria-label={mobileTitle}>
            <div className="qna-write-page__inner">
              {isApiEnabled ? (
                <QnAWriteForm mode={mode} />
              ) : (
                <p className="qna-write-page__status" role="status">
                  고객 후기 서비스를 준비하고 있습니다.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>

      <Footer />

      <EducationReviewComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={closeComingSoon}
      />
    </>
  );
};
