import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { QnAWriteForm } from "../../QnA/Write/QnAWriteForm";
import { MYPAGE_INQUIRY_WRITE_FORM_ID } from "../../QnA/Write/qnaWriteConfig";
import "../../QnA/Write/style.css";
import "../mypageShared.css";
import "./style.css";

export const MyPageInquiryEdit = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header
        variant="solid"
        mobileTitle="1:1 문의 수정"
        mobileBackVariant="home"
        onMobileClose={() => navigate("/mypage/inquiries")}
        mobileActionLabel="저장"
        mobileActionFormId={MYPAGE_INQUIRY_WRITE_FORM_ID}
      />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section mypage-section--inquiry-write">
            <header className="mypage-section__header mypage-section__header--inquiry-write">
              <h1 className="mypage-section__title">1:1 문의 수정</h1>
              <p className="mypage-section__desc">
                교육 및 발급 관련 문의를 남겨주세요
              </p>
            </header>
            <QnAWriteForm mode="edit" variant="mypage" />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
