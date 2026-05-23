import React from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { MyPageInquiryList } from "../../../modules/MyPageInquiryList";
import "../mypageShared.css";
import "./style.css";

export const MyPageInquiries = () => {
  return (
    <>
      <Header variant="solid" />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section mypage-section--inquiries">
            <header className="mypage-section__header mypage-section__header--inquiries">
              <h1 className="mypage-section__title">1:1 문의</h1>
              <p className="mypage-section__desc">
                교육 및 발급 관련 문의 내역을 확인할 수 있습니다
              </p>
            </header>
            <MyPageInquiryList />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
