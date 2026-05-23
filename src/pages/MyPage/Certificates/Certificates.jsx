import React from "react";
import { Header } from "../../../components/Header";
import "../mypageShared.css";
import "../Courses/style.css";
import "./style.css";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { CertificateList } from "../../../modules/CertificateList";

export const Certificates = () => {
  return (
    <>
      <Header variant="solid" />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section mypage-section--certificates">
            <header className="mypage-section__header mypage-section__header--certificates">
              <h1 className="mypage-section__title">수료 증서</h1>
              <p className="mypage-section__desc">
                교육 수료 내역 및 발급 가능한 수료증서를 확인할 수 있습니다
              </p>
            </header>
            <CertificateList />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
