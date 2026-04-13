import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./ColumnEditor.css";
import { Button } from "../../components/Button";
import { column, auth } from "../../store";
import { useNavigate, useParams } from "react-router-dom";

const schema = yup
  .object({
    title: yup.string().required("제목을 입력해주세요"),
    content: yup.string().required("내용을 작성해주세요"),
    hashtags: yup.string(),
  })
  .required();

export const ColumnEditor = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [contentValue, setContentValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", content: "", hashtags: "" },
  });

  const { isLoading, createColumn, updateColumn, getColumn, columnData, clearColumn } = column(
    (state) => ({
      isLoading: state.isLoading,
      createColumn: state.createColumn,
      updateColumn: state.updateColumn,
      getColumn: state.getColumn,
      columnData: state.column,
      clearColumn: state.clearColumn,
    })
  );

  const { accessToken } = auth((state) => ({
    accessToken: state.accessToken,
  }));

  const navigate = useNavigate();
  const { column_id } = useParams();

  useEffect(() => {
    if (column_id) {
      setIsEditMode(true);
      getColumn(column_id);
    } else {
      clearColumn();
      reset({ title: "", content: "", hashtags: "" });
      setContentValue("");
    }
  }, [column_id]);

  useEffect(() => {
    if (columnData && column_id) {
      reset({
        title: columnData.title,
        content: columnData.content,
        hashtags: columnData.hashtags || "",
      });
      setContentValue(columnData.content || "");
    }
  }, [columnData, column_id, reset]);

  const watchedContent = watch("content");
  useEffect(() => {
    setContentValue(watchedContent || "");
  }, [watchedContent]);

  const onSubmit = async (data) => {
    const { accessToken: token } = auth.getState();
    if (isEditMode) {
      const success = await updateColumn(column_id, data.title, data.content, data.hashtags, token);
      if (success) {
        navigate("/admin/column");
      }
    } else {
      const success = await createColumn(data.title, data.content, data.hashtags, token);
      if (success) {
        navigate("/admin/column");
      }
    }
  };

  return (
    <main className="column-editor-page-background">
      <div className="column-editor-page">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="column-editor-title-wrap">
            <h2 className="column-editor-title">
              {isEditMode ? "칼럼 수정" : "칼럼 작성"}
            </h2>
            <Button
              type="submit"
              label={isEditMode ? "수정하기" : "저장하기"}
              disabled={isLoading}
              style={{ width: "105px", height: "35px", fontSize: "14px" }}
            />
          </div>

          <label htmlFor="column-title" className="column-editor-label">
            제목
          </label>
          <input
            {...register("title")}
            id="column-title"
            type="text"
            placeholder="칼럼 제목을 입력해주세요"
            className="column-editor-input"
          />
          {errors.title && (
            <p className="input-error-message">{errors.title.message}</p>
          )}

          <label htmlFor="column-hashtags" className="column-editor-label">
            해시태그
          </label>
          <input
            {...register("hashtags")}
            id="column-hashtags"
            type="text"
            placeholder="#태그1 #태그2 #태그3"
            className="column-editor-input"
          />

          <div className="column-editor-content-header">
            <label className="column-editor-label" style={{ margin: 0 }}>
              내용 (HTML)
            </label>
            <button
              type="button"
              className="column-editor-preview-btn"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "HTML 편집" : "미리보기"}
            </button>
          </div>

          {previewMode ? (
            <div
              className="column-editor-preview"
              dangerouslySetInnerHTML={{ __html: contentValue }}
            />
          ) : (
            <textarea
              {...register("content")}
              id="column-editor-textarea"
              placeholder="HTML 형식으로 내용을 작성해주세요&#10;예: <p>내용</p><img src='...'>"
              className="column-editor-textarea"
            />
          )}
          {errors.content && (
            <p className="input-error-message">{errors.content.message}</p>
          )}
        </form>
      </div>
    </main>
  );
};
