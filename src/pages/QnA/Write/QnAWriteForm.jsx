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

const schema = yup
  .object({
    title: yup.string().required("제목을 입력해주세요"),
    category: yup.string().required("카테고리를 선택해주세요"),
    content: yup
      .string()
      .test("content", "내용을 작성해주세요", (val) => !isQuillEmpty(val)),
  })
  .required();

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

  const { createInquiry, updateInquiry, getInquiry, QnA, isLoading } = inquiry(
    (state) => ({
      createInquiry: state.createInquiry,
      updateInquiry: state.updateInquiry,
      getInquiry: state.getInquiry,
      QnA: state.QnA,
      isLoading: state.isLoading,
    })
  );

  const refreshAccessToken = auth((state) => state.refreshAccessToken);

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", category: "", content: "" },
  });

  useEffect(() => {
    if (isEdit && boardPostId) {
      getInquiry(boardPostId);
    }
  }, [isEdit, boardPostId, getInquiry]);

  useEffect(() => {
    if (isEdit && QnA) {
      reset({
        title: QnA.title ?? "",
        category: QnA.category ?? "",
        content: QnA.content ?? "",
      });
    }
  }, [isEdit, QnA, reset]);

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
      if (isEdit) {
        const success = await updateInquiry(
          boardPostId,
          data.title,
          data.category,
          data.content
        );
        if (success) {
          navigate(
            isMypage
              ? `/mypage/inquiries`
              : reviewBoardRoutes.detail(boardPostId)
          );
        }
      } else {
        const success = await createInquiry(
          myUserId,
          data.title,
          data.category,
          data.content,
          accessToken
        );
        if (success) {
          navigate(isMypage ? "/mypage/inquiries" : reviewBoardRoutes.list);
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
          </div>

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

          <QnAWriteAttachments
            files={attachments}
            onAdd={handleAddAttachments}
            onRemove={handleRemoveAttachment}
          />
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
