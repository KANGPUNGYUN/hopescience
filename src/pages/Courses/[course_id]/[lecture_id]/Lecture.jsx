import "./style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../../../modules/Modal";
import { service, courseInquiry, enrollment } from "../../../../store";
import {
  LectureBackIcon,
  LectureCloseIcon,
  LectureInfoIcon,
  LectureNextNavIcon,
  LecturePrevNavIcon,
} from "./LectureIcons";
import { LectureVideoSection } from "./LectureVideoSection";
import { LectureCurriculumPanel } from "./LectureCurriculumPanel";
import { LectureQnaPanel } from "./LectureQnaPanel";
import {
  getEnrollmentPeriodLabel,
  LECTURE_COMPLETION_NOTE,
  LECTURE_TABS,
} from "./lecturePageConfig";

export const Lecture = () => {
  const { course_id, lecture_id } = useParams();
  const navigate = useNavigate();
  const [nextLecture, setNextLecture] = useState({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleVideoComplete = useCallback(() => {
    setShowCompletionModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCompletionModal(false);
  }, []);

  useEffect(() => {
    setShowCompletionModal(false);
  }, [lecture_id]);

  const { isLoading, getLecture, lecture, getNextLecture, getService, course } =
    service((state) => ({
      isLoading: state.isLoading,
      getLecture: state.getLecture,
      lecture: state.lecture,
      getNextLecture: state.getNextLecture,
      getService: state.getService,
      course: state.course,
    }));

  const { isCourseInquiryLoading, getCourseInquiries, courseInquiries } =
    courseInquiry((state) => ({
      isCourseInquiryLoading: state.isCourseInquiryLoading,
      getCourseInquiries: state.getCourseInquiries,
      courseInquiries: state.courseInquiries,
    }));

  const {
    getIsEnrolled,
    enrollment: enrollmentData,
    getEnrollmentProgress,
    enrollmentProgress,
    isEnrollmentLoading,
  } = enrollment((state) => ({
    getIsEnrolled: state.getIsEnrolled,
    enrollment: state.enrollment,
    getEnrollmentProgress: state.getEnrollmentProgress,
    enrollmentProgress: state.enrollmentProgress,
    isEnrollmentLoading: state.isLoading,
  }));

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  useEffect(() => {
    if (!course_id) {
      alert("해당 강의는 존재하지 않는 강의입니다.");
      navigate("/courses");
      return;
    }

    if (!myUserId) {
      alert("로그인 상태가 아닙니다. 다시 로그인해 주세요.");
      navigate("/signin");
      return;
    }

    getIsEnrolled(myUserId, course_id);
  }, [course_id, myUserId, getIsEnrolled, navigate]);

  useEffect(() => {
    if (!course_id || !myUserId || isEnrollmentLoading) return;

    if (!enrollmentData) {
      alert("구매 후에 이용이 가능합니다.");
      navigate(`/courses/${course_id}`, { replace: true });
      return;
    }

    getLecture(lecture_id);
    getService(course_id);
    getCourseInquiries(course_id);
  }, [
    course_id,
    lecture_id,
    myUserId,
    isEnrollmentLoading,
    enrollmentData,
    getLecture,
    getService,
    getCourseInquiries,
    navigate,
  ]);

  useEffect(() => {
    if (enrollmentData?.id) {
      getEnrollmentProgress(enrollmentData.id);
    }
  }, [enrollmentData, getEnrollmentProgress]);

  useEffect(() => {
    if (!enrollmentData?.id) return;

    async function fetchData() {
      setNextLecture({});
      const res = await getNextLecture(course_id, lecture_id);
      setNextLecture(res || {});
    }
    fetchData();
  }, [course_id, lecture_id, enrollmentData, getNextLecture]);

  const filteredInquiries = courseInquiries?.filter(
    (inquiry) => inquiry?.lecture_id === Number(lecture_id)
  );

  const courseTitle = course?.title || lecture?.title || "";
  const prevLink = nextLecture?.previous
    ? `/courses/${course_id}/${nextLecture.previous.lecture_id}`
    : null;
  const nextLink = nextLecture?.next
    ? `/courses/${course_id}/${nextLecture.next.lecture_id}`
    : null;

  if (myUserId && course_id && !isEnrollmentLoading && !enrollmentData) {
    return null;
  }

  return (
    <>
      <div className="lecture-page">
        <header className="lecture-page__topbar">
          <button
            type="button"
            className="lecture-page__back"
            onClick={() => navigate(`/courses/${course_id}`)}
            aria-label="강의 목록으로"
          >
            <LectureBackIcon />
          </button>
          <h1 className="lecture-page__topbar-title">{courseTitle}</h1>
        </header>

        <div
          className={`lecture-page__layout${
            sidebarOpen ? "" : " lecture-page__layout--sidebar-closed"
          }`}
        >
          <div className="lecture-page__main">
            <LectureVideoSection
              videoUrl={lecture?.video_url}
              enrollmentData={enrollmentData}
              lectureId={lecture_id}
              courseId={course_id}
              onVideoComplete={handleVideoComplete}
              nextLecture={nextLecture}
              isLoading={isLoading && !lecture}
            />

            <div className="lecture-page__meta-block lecture-page__meta-block--mobile">
              <div className="lecture-page__meta lecture-page__meta-row">
                {prevLink ? (
                  <Link to={prevLink} className="lecture-page__meta-nav" aria-label="이전 강의">
                    <LecturePrevNavIcon />
                  </Link>
                ) : (
                  <span className="lecture-page__meta-nav lecture-page__meta-nav--disabled" aria-hidden>
                    <LecturePrevNavIcon />
                  </span>
                )}
                <div className="lecture-page__meta-center">
                  <h2 className="lecture-page__lecture-title">{lecture?.title}</h2>
                </div>
                {nextLink ? (
                  <Link to={nextLink} className="lecture-page__meta-nav" aria-label="다음 강의">
                    <LectureNextNavIcon />
                  </Link>
                ) : (
                  <span className="lecture-page__meta-nav lecture-page__meta-nav--disabled" aria-hidden>
                    <LectureNextNavIcon />
                  </span>
                )}
              </div>
              <div className="lecture-page__meta-sub">
                <span className="lecture-page__meta-period">
                  {getEnrollmentPeriodLabel(enrollmentData)}
                </span>
                <p className="lecture-page__completion-note">
                  <LectureInfoIcon size={12} />
                  <span>{LECTURE_COMPLETION_NOTE}</span>
                </p>
              </div>
            </div>

            <div className="lecture-page__tabs lecture-page__tabs--mobile">
              {LECTURE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`lecture-page__tab${
                    activeTab === tab.id ? " lecture-page__tab--active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="lecture-page__mobile-panel">
              {activeTab === "curriculum" ? (
                <LectureCurriculumPanel
                  course={course}
                  enrollmentData={enrollmentData}
                  enrollmentProgress={enrollmentProgress}
                  hideSidebarHeader
                />
              ) : (
                <LectureQnaPanel
                  inquiries={filteredInquiries}
                  isLoading={isCourseInquiryLoading}
                />
              )}
            </div>
          </div>

          {sidebarOpen && (
            <aside className="lecture-page__sidebar" aria-label="교육과정 및 QnA">
              <div className="lecture-page__sidebar-head">
                <div className="lecture-page__tabs lecture-page__tabs--desktop">
                  {LECTURE_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`lecture-page__tab${
                        activeTab === tab.id ? " lecture-page__tab--active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="lecture-page__sidebar-close"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="사이드바 닫기"
                >
                  <LectureCloseIcon />
                </button>
              </div>

              <div className="lecture-page__sidebar-body">
                {activeTab === "curriculum" ? (
                  <LectureCurriculumPanel
                    course={course}
                    enrollmentData={enrollmentData}
                    enrollmentProgress={enrollmentProgress}
                  />
                ) : (
                  <LectureQnaPanel
                    inquiries={filteredInquiries}
                    isLoading={isCourseInquiryLoading}
                  />
                )}
              </div>
            </aside>
          )}

          {!sidebarOpen && (
            <button
              type="button"
              className="lecture-page__sidebar-reopen"
              onClick={() => setSidebarOpen(true)}
            >
              교육과정 열기
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showCompletionModal}
        onClose={handleCloseModal}
        onConfirm={handleCloseModal}
        modalTitle="강의 수강 완료"
        confirmLabel="확인"
      >
        <p>강의를 정상적으로 수강하셨습니다.</p>
      </Modal>
    </>
  );
};
