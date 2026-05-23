import { Header } from "../../../components/Header";
import "./style.css";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { TabWithCourses } from "../../../modules/TabWithCourses";

export const MyPage = () => {
  return (
    <>
      <Header variant="solid" />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section">
            <header className="mypage-section__header">
              <h1 className="mypage-section__title">교육 진행 현황</h1>
              <p className="mypage-section__desc">
                현재 진행 중인 교육 과정과 이수 상태를 확인할 수 있습니다
              </p>
            </header>
            <TabWithCourses />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
