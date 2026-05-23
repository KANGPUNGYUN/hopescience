import React from "react";
import { Header } from "../../../components/Header";
import "../mypageShared.css";
import "./style.css";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { OrderList } from "../../../modules/OrderList";

export const Orders = () => {
  return (
    <>
      <Header variant="solid" />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section mypage-section--orders">
            <header className="mypage-section__header mypage-section__header--orders">
              <h1 className="mypage-section__title">결제 내역</h1>
              <p className="mypage-section__desc">
                결제 및 발급 내역을 확인할 수 있습니다
              </p>
            </header>
            <OrderList />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
