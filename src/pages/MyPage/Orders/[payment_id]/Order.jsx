import React from "react";
import { Header } from "../../../../components/Header";
import { Footer } from "../../../../components/Footer";
import { MyPageSideBar } from "../../../../modules/MyPageSideBar";
import { OrderDetail } from "../../../../modules/OrderDetail";
import "../../mypageShared.css";
import "../style.css";
import "./style.css";

export const Order = () => {
  return (
    <>
      <Header variant="solid" />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section mypage-section--orders mypage-section--order-detail">
            <header className="mypage-section__header mypage-section__header--order-detail">
              <h1 className="mypage-section__title">결제 상세</h1>
              <p className="mypage-section__desc">
                결제 내역의 상세 정보를 확인할 수 있습니다
              </p>
            </header>
            <OrderDetail />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
