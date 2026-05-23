import "./style.css";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Header, Footer } from "../../../components";
import { VideoModal } from "../../../modules/VideoModal";
import { service, courseInquiry, enrollment } from "../../../store";
import { CourseDetailHero } from "./CourseDetailHero";
import { CourseDetailAside } from "./CourseDetailAside";
import { CourseDetailTabs } from "./CourseDetailTabs";
import { CourseDetailDescription } from "./CourseDetailDescription";
import { CourseCurriculum } from "./CourseCurriculum";
import { CourseQnaList } from "./CourseQnaList";
import { CourseMobileBar } from "./CourseMobileBar";
import {
  getCompletedLectureCount,
  getCourseTotalLectureCount,
} from "./[lecture_id]/lecturePageConfig";
import { sanitizeCourseDescription } from "./courseDetailConfig";

export const Course = () => {
  const { course_id } = useParams();
  const location = useLocation();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const descriptionRef = useRef(null);
  const curriculumRef = useRef(null);
  const qnaRef = useRef(null);

  const { isLoading, getService, course, clearCourse } = service((state) => ({
    isLoading: state.isLoading,
    getService: state.getService,
    clearCourse: state.clearCourse,
    course: state.course || null,
  }));

  const {
    getCourseInquiries,
    isLoading: isCourseInquiriesLoading,
    courseInquiries,
  } = courseInquiry((state) => ({
    getCourseInquiries: state.getCourseInquiries,
    isLoading: state.isLoading,
    courseInquiries: state.courseInquiries || null,
  }));

  const {
    getIsEnrolled,
    enrollment: enrollmentData,
    enrollmentProgress,
    clearEnrollment,
    refreshEnrollmentDetails,
  } = enrollment((state) => ({
    getIsEnrolled: state.getIsEnrolled,
    enrollment: state.enrollment,
    enrollmentProgress: state.enrollmentProgress,
    clearEnrollment: state.clearEnrollment,
    refreshEnrollmentDetails: state.refreshEnrollmentDetails,
  }));

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  const courseDescription = useMemo(
    () => sanitizeCourseDescription(course?.description),
    [course?.description]
  );

  const sectionRefs = useMemo(
    () => ({
      description: descriptionRef,
      curriculum: curriculumRef,
      qna: qnaRef,
    }),
    []
  );

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    const ref = sectionRefs[tabId];
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sectionRefs]);

  useEffect(() => {
    clearEnrollment();
    clearCourse();
  }, [course_id, clearEnrollment, clearCourse]);

  useEffect(() => {
    if (course_id && myUserId) {
      getIsEnrolled(myUserId, course_id);
    }
    getService(course_id);
    getCourseInquiries(course_id);
  }, [course_id, myUserId, getIsEnrolled, getService, getCourseInquiries]);

  const refreshEnrollmentState = useCallback(async () => {
    if (!enrollmentData?.id) return;
    await refreshEnrollmentDetails(enrollmentData.id);
  }, [enrollmentData?.id, refreshEnrollmentDetails]);

  useEffect(() => {
    if (enrollmentData?.id) {
      refreshEnrollmentState();
    }
  }, [enrollmentData?.id, location.key, refreshEnrollmentState]);

  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === "visible") {
        refreshEnrollmentState();
      }
    };

    document.addEventListener("visibilitychange", handleVisible);
    return () => document.removeEventListener("visibilitychange", handleVisible);
  }, [refreshEnrollmentState]);

  useEffect(() => {
    if (!course || !enrollmentData) return;

    const total = getCourseTotalLectureCount(course, enrollmentData);
    const completed = getCompletedLectureCount(
      enrollmentProgress,
      enrollmentData
    );

    setIsCourseCompleted(
      Boolean(enrollmentData.is_completed) ||
        (total > 0 && completed >= total)
    );
  }, [enrollmentProgress, course, enrollmentData]);

  const showMobileBar = !isLoading && course && !enrollmentData;

  return (
    <>
      <div className="course-detail-page-shell">
        <Header variant="solid" />
        <main
          className={`course-detail-page${
            showMobileBar ? " course-detail-page--with-mobile-bar" : ""
          }`}
        >
          {isLoading ? (
            <p className="course-detail-page__loading">불러오는 중...</p>
          ) : (
            <>
              <div className="course-detail-layout">
                <div className="course-detail-hero-band" aria-hidden="true" />
                <CourseDetailHero
                  course={course}
                  enrollmentData={enrollmentData}
                  isCourseCompleted={isCourseCompleted}
                  myUserId={myUserId}
                  onPreviewClick={() => setIsPreviewOpen(true)}
                />

                <aside
                  className="course-detail-layout__sidebar"
                  aria-label="수강 정보"
                >
                  <CourseDetailAside
                    course={course}
                    enrollmentData={enrollmentData}
                    isCourseCompleted={isCourseCompleted}
                    myUserId={myUserId}
                  />
                </aside>

                <div className="course-detail-body">
                  <CourseDetailTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                  />

                  <div className="course-detail-content">
                    <CourseDetailDescription
                      description={courseDescription}
                      sectionRef={descriptionRef}
                    />
                    <CourseCurriculum
                      sections={course?.sections}
                      enrollmentData={enrollmentData}
                      enrollmentProgress={enrollmentProgress}
                      sectionRef={curriculumRef}
                    />
                    <CourseQnaList
                      inquiries={courseInquiries ?? []}
                      isLoading={isCourseInquiriesLoading}
                      sectionRef={qnaRef}
                    />
                  </div>
                </div>
              </div>

              <CourseMobileBar
                course={course}
                myUserId={myUserId}
                visible={showMobileBar}
              />
            </>
          )}

          <VideoModal
            isOpen={isPreviewOpen}
            videoSrc={course?.sections?.[0]?.lectures?.[0]?.video_url}
            onClose={() => setIsPreviewOpen(false)}
          />
        </main>
      </div>
      <Footer />
    </>
  );
};
