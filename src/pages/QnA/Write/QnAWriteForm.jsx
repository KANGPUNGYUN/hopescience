import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { auth, inquiry } from "../../../store";
import { QnAWriteEditor } from "./QnAWriteEditor";
import { QnAWriteAttachments } from "./QnAWriteAttachments";
import { QnAWriteCategorySelect } from "./QnAWriteCategorySelect";
import {
  MYPAGE_INQUIRY_WRITE_CATEGORIES,
  MYPAGE_INQUIRY_WRITE_FORM_ID,
  QNA_WRITE_CATEGORIES,
  QNA_WRITE_PAGE_TITLE,
} from "./qnaWriteConfig";
import { reviewBoardRoutes } from "../qnaBoardConfig";
import { isQuillEmpty } from "./qnaWriteQuill";

const buildSchema = (isMypage) =>
  yup
    .object({
      title: yup.string().required("제목을 입력해주세요"),
      ...(isMypage
        ? { category: yup.string().required("카테고리를 선택해주세요") }
        : {
            course_id: yup
              .string()
              .required("수강 중인 강의를 선택해주세요")
              .min(1, "수강 중인 강의를 선택해주세요"),
            display_date: yup
              .string()
              .required("작성일을 선택해주세요")
              .matches(/^\d{4}-\d{2}-\d{2}$/, "올바른 날짜 형식이 아닙니다"),
          }),
      content: yup
        .string()
        .test("content", "내용을 작성해주세요", (val) => !isQuillEmpty(val)),
    })
    .required();

const toDateInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const todayDateInputValue = () => toDateInputValue(new Date());

function createAttachmentEntry(file) {
  const isImage = file.type.startsWith("image/");
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    file,
    name: file.name,
    previewUrl: isImage ? URL.createObjectURL(file) : null,
  };
}

export const QnAWriteForm = ({ mode = "create", variant = "board" }) => {
  const { review_id, inquiry_id } = useParams();
  const boardPostId = review_id ?? inquiry_id;
  const navigate = useNavigate();
  const isMypage = variant === "mypage";
  const isEdit = mode === "edit";
  const pageTitle = isEdit ? QNA_WRITE_PAGE_TITLE.edit : QNA_WRITE_PAGE_TITLE.create;
  const categories = isMypage ? MYPAGE_INQUIRY_WRITE_CATEGORIES : QNA_WRITE_CATEGORIES;
  const formId = isMypage ? MYPAGE_INQUIRY_WRITE_FORM_ID : undefined;

  const [attachments, setAttachments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const {
    createInquiry,
    updateInquiry,
    getInquiry,
    createReview,
    updateReview,
    uploadReviewImage,
    getReview,
    getMyEnrolledReviewCourses,
    QnA,
    isLoading,
  } = inquiry((state) => ({
    createInquiry: state.createInquiry,
    updateInquiry: state.updateInquiry,
    getInquiry: state.getInquiry,
    createReview: state.createReview,
    updateReview: state.updateReview,
    uploadReviewImage: state.uploadReviewImage,
    getReview: state.getReview,
    getMyEnrolledReviewCourses: state.getMyEnrolledReviewCourses,
    QnA: state.QnA,
    isLoading: state.isLoading,
  }));

  const refreshAccessToken = auth((state) => state.refreshAccessToken);

  const myUserId = useMemo(() => {
    const data = localStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(buildSchema(isMypage)),
    defaultValues: isMypage
      ? { title: "", category: "", content: "" }
      : { title: "", course_id: "", display_date: todayDateInputValue(), content: "" },
  });

  useEffect(() => {
    if (!isEdit || !boardPostId) return;
    if (isMypage) {
      getInquiry(boardPostId);
    } else {
      getReview(boardPostId);
    }
  }, [isEdit, boardPostId, isMypage, getInquiry, getReview]);

  useEffect(() => {
    if (isMypage) return;
    let active = true;
    (async () => {
      const list = await getMyEnrolledReviewCourses();
      if (active) setEnrolledCourses(list);
    })();
    return () => {
      active = false;
    };
  }, [isMypage, getMyEnrolledReviewCourses]);

  useEffect(() => {
    if (isEdit && QnA) {
      reset(
        isMypage
          ? {
              title: QnA.title ?? "",
              category: QnA.category ?? "",
              content: QnA.content ?? "",
            }
          : {
              title: QnA.title ?? "",
              course_id:
                QnA.course_id != null ? String(QnA.course_id) : "",
              display_date:
                toDateInputValue(QnA.created_at) || todayDateInputValue(),
              content: QnA.content ?? "",
            }
      );
    }
  }, [isEdit, QnA, isMypage, reset]);

  const courseOptions = useMemo(
    () =>
      enrolledCourses.map((course) => ({
        value: String(course.course_id),
        label: course.course_title,
      })),
    [enrolledCourses]
  );

  const handleAddAttachments = (files) => {
    setAttachments((prev) => {
      const next = [...prev];
      files.forEach((file) => {
        const entry = createAttachmentEntry(file);
        if (!next.some((item) => item.id === entry.id)) {
          next.push(entry);
        }
      });
      return next;
    });
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const onSubmit = async (data, retryAttempted = false) => {
    if (!myUserId) {
      alert("로그인이 필요한 작업입니다.");
      return;
    }

    const { accessToken, refreshToken } = auth.getState();

    try {
      if (isMypage) {
        if (isEdit) {
          const success = await updateInquiry(
            boardPostId,
            data.title,
            data.category,
            data.content
          );
          if (success) navigate("/mypage/inquiries");
        } else {
          const success = await createInquiry(
            myUserId,
            data.title,
            data.category,
            data.content,
            accessToken
          );
          if (success) navigate("/mypage/inquiries");
        }
      } else if (isEdit) {
        const success = await updateReview(
          boardPostId,
          data.course_id,
          data.title,
          data.content,
          data.display_date ? `${data.display_date}T00:00:00` : undefined
        );
        if (success) {
          // const imageFile = attachments.find((a) =>
          //   a.file.type.startsWith("image/")
          // )?.file;
          // if (imageFile) await uploadReviewImage(boardPostId, imageFile);
          navigate(reviewBoardRoutes.detail(boardPostId));
        }
      } else {
        const reviewId = await createReview(
          data.course_id,
          data.title,
          data.content,
          accessToken,
          data.display_date ? `${data.display_date}T00:00:00` : undefined
        );
        if (reviewId) {
          // const imageFile = attachments.find((a) =>
          //   a.file.type.startsWith("image/")
          // )?.file;
          // if (imageFile) await uploadReviewImage(reviewId, imageFile);
          navigate(reviewBoardRoutes.list);
        }
      }
    } catch (error) {
      if (error?.response?.status === 401 && !retryAttempted) {
        await refreshAccessToken(refreshToken);
        return onSubmit(data, true);
      }
      console.error("문의 저장 실패:", error);
    }
  };

  const handleCancel = () => {
    if (isMypage) {
      navigate("/mypage/inquiries");
      return;
    }
    if (isEdit && boardPostId) {
      navigate(
        isMypage
          ? "/mypage/inquiries"
          : reviewBoardRoutes.detail(boardPostId)
      );
      return;
    }
    navigate(isMypage ? "/mypage/inquiries" : reviewBoardRoutes.list);
  };

  if (isEdit && isLoading && !QnA) {
    return <p className="qna-write-page__status">불러오는 중...</p>;
  }

  return (
    <div
      className={`qna-write-form-wrap${
        isMypage ? " qna-write-form-wrap--mypage" : ""
      }`}
    >
      {!isMypage && <h2 className="qna-write-form__page-title">{pageTitle}</h2>}

      <form
        id={formId}
        className={`qna-write-form${isMypage ? " qna-write-form--mypage" : ""}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="qna-write-form__card">
          <div className="qna-write-form__row qna-write-form__row--split">
            <div className="qna-write-form__field">
              <label htmlFor="qna-write-title" className="qna-write-form__label">
                제목 <span className="qna-write-form__required">*</span>
              </label>
              <input
                id="qna-write-title"
                type="text"
                className="qna-write-form__input"
                placeholder="제목을 입력해주세요"
                {...register("title")}
              />
              {errors.title && (
                <p className="qna-write-form__error">{errors.title.message}</p>
              )}
            </div>

            {isMypage ? (
              <div className="qna-write-form__field">
                <label htmlFor="qna-write-category" className="qna-write-form__label">
                  카테고리 <span className="qna-write-form__required">*</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <QnAWriteCategorySelect
                      value={field.value}
                      onChange={field.onChange}
                      options={categories}
                      error={errors.category?.message}
                    />
                  )}
                />
              </div>
            ) : (
              <div className="qna-write-form__field">
                <label htmlFor="qna-write-course" className="qna-write-form__label">
                  수강 강의 <span className="qna-write-form__required">*</span>
                </label>
                <Controller
                  name="course_id"
                  control={control}
                  render={({ field }) => (
                    <QnAWriteCategorySelect
                      value={field.value}
                      onChange={field.onChange}
                      options={courseOptions}
                      error={errors.course_id?.message}
                      placeholder={
                        courseOptions.length === 0
                          ? "수강 중인 강의가 없습니다"
                          : "수강 중인 강의를 선택해주세요"
                      }
                    />
                  )}
                />
              </div>
            )}
          </div>

          {!isMypage && (
            <div className="qna-write-form__field">
              <label htmlFor="qna-write-date" className="qna-write-form__label">
                작성일 <span className="qna-write-form__required">*</span>
              </label>
              <input
                id="qna-write-date"
                type="date"
                className="qna-write-form__input"
                max={todayDateInputValue()}
                {...register("display_date")}
              />
              {errors.display_date && (
                <p className="qna-write-form__error">
                  {errors.display_date.message}
                </p>
              )}
            </div>
          )}

          <div className="qna-write-form__field">
            <label htmlFor="qna-write-content" className="qna-write-form__label">
              본문 <span className="qna-write-form__required">*</span>
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <QnAWriteEditor
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />
          </div>

          {/* <QnAWriteAttachments
            files={attachments}
            onAdd={handleAddAttachments}
            onRemove={handleRemoveAttachment}
          /> */}
        </div>

        <div className="qna-write-form__actions">
          <button
            type="button"
            className="qna-write-form__cancel"
            onClick={handleCancel}
          >
            취소
          </button>
          <button type="submit" className="qna-write-form__submit" disabled={isLoading}>
            저장
          </button>
        </div>
      </form>
    </div>
  );
};
