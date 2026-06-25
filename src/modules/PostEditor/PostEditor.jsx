import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./PostEditor.css";
import { Button } from "../../components/Button";
import { inquiry, service, courseInquiry, auth } from "../../store";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  isReviewBoardDetailPath,
  isReviewBoardNewPath,
  reviewBoardRoutes,
} from "../../pages/QnA/qnaBoardConfig";

const schema = yup
  .object({
    title: yup.string().required("제목을 입력해주세요"),
    category: yup.string().required("카테고리를 선택해주세요"),
    content: yup.string().required("내용을 작성해주세요"),
  })
  .required();

export const PostEditor = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      category: selectedCategory,
      content: "",
    },
  });
  const [buttonLabel, setButtonLabel] = useState("수정하기");

  const { refreshAccessToken, accessToken } = auth((state) => ({
    refreshAccessToken: state.refreshAccessToken,
    accessToken: state.accessToken,
  }));
  const {
    isLoading,
    createInquiry,
    updateInquiry,
    getInquiry,
    createReview,
    updateReview,
    getReview,
    QnA,
  } = inquiry((state) => ({
    isLoading: state.isLoading,
    createInquiry: state.createInquiry,
    updateInquiry: state.updateInquiry,
    getInquiry: state.getInquiry,
    createReview: state.createReview,
    updateReview: state.updateReview,
    getReview: state.getReview,
    QnA: state.QnA,
  }));

  const { getService, course, isCategoryLoading, clearCourse } = service(
    (state) => ({
      getService: state.getService,
      course: state.course,
      isCategoryLoading: state.isCategoryLoading,
      clearCourse: state.clearCourse,
    })
  );

  const {
    getCourseInquiry,
    createCourseInquiry,
    updateCourseInquiry,
    courseQnA,
  } = courseInquiry((state) => ({
    getCourseInquiry: state.getCourseInquiry,
    createCourseInquiry: state.createCourseInquiry,
    updateCourseInquiry: state.updateCourseInquiry,
    courseQnA: state.courseQnA,
  }));
  const data = localStorage.getItem("auth-storage");
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  const refreshToken = data ? JSON.parse(data).state?.refreshToken : null;
  const navigate = useNavigate();
  const location = useLocation();
  let { inquiry_id, course_id, lecture_id, course_inquiry_id, review_id } =
    useParams();
  const boardPostId = review_id ?? inquiry_id;

  useEffect(() => {
    if (
      isReviewBoardNewPath(location.pathname) ||
      (course_id &&
        lecture_id &&
        location.pathname === `/courses/${course_id}/${lecture_id}/new`)
    ) {
      clearCourse();
      reset({
        title: "",
        category: "",
        content: "",
      });
      if (course_id && lecture_id) {
        getService(course_id).then(() => {
          if (course && course.category) {
            setSelectedCategory(course.category.name);
            reset({ title: "", category: course?.category.name, content: "" });
          }
        });
      }
      setButtonLabel("저장하기");
    } else if (course_id && lecture_id && course_inquiry_id) {
      getCourseInquiry(course_id, course_inquiry_id);
      getService(course_id);
    } else if (boardPostId) {
      if (isReviewBoardDetailPath(location.pathname, boardPostId)) {
        getReview(boardPostId);
      } else {
        getInquiry(boardPostId);
      }
    }
  }, [location.pathname, boardPostId, getInquiry, getReview, reset]);

  useEffect(() => {
    if (QnA && !isReviewBoardNewPath(location.pathname)) {
      clearCourse();
      reset({
        title: QnA?.title,
        category: QnA?.category,
        content: QnA?.content,
      });
    } else if (
      courseQnA &&
      location.pathname ===
        `/courses/${course_id}/${lecture_id}/${course_inquiry_id}/edit`
    ) {
      reset({
        title: courseQnA?.title,
        category: course?.category.name,
        content: courseQnA?.content,
      });
    }
  }, [QnA, reset]);

  const onSubmit = (data, retryAttempted = false) => {
    console.log(data);
    if (myUserId) {
      const { accessToken, refreshToken } = auth.getState();
      if (buttonLabel === "저장하기") {
        if (course_id && lecture_id) {
          createCourseInquiry(
            course_id,
            lecture_id,
            data.title,
            data.content,
            accessToken
          )
            .then(() => {
              navigate(`/courses/${course_id}/${lecture_id}`);
            })
            .catch(async (error) => {
              if (error.response.status === 401 && !retryAttempted) {
                await refreshAccessToken(refreshToken);
                return onSubmit(data, true); // 재시도
              } else {
                console.error("Error during course inquiry creation:", error);
                alert("에러가 발생했습니다: " + error.message);
              }
            });
        } else if (isReviewBoardNewPath(location.pathname)) {
          createReview(data.title, data.category, data.content, accessToken)
            .then((success) => {
              if (success) navigate(reviewBoardRoutes.list);
            })
            .catch(async (error) => {
              if (error?.response?.status === 401 && !retryAttempted) {
                await refreshAccessToken(refreshToken);
                return onSubmit(data, true);
              }
              console.error("Error during review creation:", error);
            });
        } else {
          createInquiry(myUserId, data.title, data.category, data.content, accessToken)
            .then(() => {
              navigate(reviewBoardRoutes.list);
            })
            .catch(async (error) => {
              if (error?.response?.status === 401 && !retryAttempted) {
                await refreshAccessToken(refreshToken);
                return onSubmit(data, true);
              } else {
                console.error("Error during inquiry creation:", error);
              }
            });
        }
      } else if (buttonLabel === "수정하기") {
        if (course_id && lecture_id && course_inquiry_id) {
          const CourseQnAUpdateSuccess = updateCourseInquiry(
            course_id,
            course_inquiry_id,
            data.title,
            data.content
          );
          if (CourseQnAUpdateSuccess) {
            navigate(`/courses/${course_id}/${lecture_id}`);
          }
        } else if (isReviewBoardDetailPath(location.pathname, boardPostId)) {
          updateReview(boardPostId, data.title, data.category, data.content).then(
            (success) => {
              if (success) navigate(reviewBoardRoutes.list);
            }
          );
        } else {
          const QnAUpdateSuccess = updateInquiry(
            boardPostId,
            data.title,
            data.category,
            data.content
          );
          if (QnAUpdateSuccess) {
            navigate(reviewBoardRoutes.list);
          }
        }
      }
    } else {
      alert("로그인이 필요한 작업입니다.");
    }
  };

  useEffect(() => {
    if (course && course.category) {
      setSelectedCategory(course.category.name);
    }
  }, [course]);

  useEffect(() => {
    setValue("category", selectedCategory);
  }, [selectedCategory, setValue]);

  return (
    <main className="post-editor-page-background">
      <div className="post-editor-page">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="post-editor-title-wrap">
            <h2 className="post-editor-title">문의하기</h2>
            <Button
              type="submit"
              label={buttonLabel !== undefined ? buttonLabel : "수정하기"}
              style={{
                width: "105px",
                height: "35px",
                fontSize: "14px",
              }}
            />
          </div>
          <label htmlFor="title" className="post-editor-label">
            제목
          </label>
          <input
            {...register("title")}
            id="title"
            name="title"
            type="text"
            placeholder="문의할 제목을 입력해주세요"
            className="post-editor-title-input"
          />
          {errors.title && (
            <p className="input-error-message">{errors.title.message}</p>
          )}

          <label htmlFor="category" className="post-editor-label">
            카테고리
          </label>
          <select
            name="category"
            id="post-editor-category"
            {...register("category")}
            value={selectedCategory} //
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {course ? (
              <option value={course?.category?.name} selected>
                {course?.category?.name}
              </option>
            ) : (
              <>
                <option value="">카테고리를 선택해주세요</option>
                <option value="강의 문의">강의 문의</option>
                <option value="계정 문의">계정 문의</option>
                <option value="결제/환불 문의">결제/환불 문의</option>
                <option value="서비스 오류 문의">서비스 오류 문의</option>
                <option value="기타 문의">기타 문의</option>
              </>
            )}
          </select>
          {errors.category && (
            <p className="input-error-message">{errors.category.message}</p>
          )}

          <textarea
            name="content"
            id="post-editor-textarea"
            wrap="hard"
            placeholder="문의할 내용을 작성해주세요"
            {...register("content")}
          ></textarea>
          {errors.content && (
            <p className="input-error-message">{errors.content.message}</p>
          )}
        </form>
      </div>
    </main>
  );
};
