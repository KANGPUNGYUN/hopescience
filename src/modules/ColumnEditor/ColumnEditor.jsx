import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./ColumnEditor.css";
import { Button } from "../../components/Button";
import { column, auth } from "../../store";
import { useNavigate, useParams } from "react-router-dom";

// 링크를 항상 새 창으로 열도록 커스텀 Link blot 설정
const Link = Quill.import("formats/link");
class ExternalLink extends Link {
  static create(value) {
    const node = super.create(value);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
    return node;
  }
}
Quill.register(ExternalLink, true);

const schema = yup
  .object({
    title: yup.string().required("제목을 입력해주세요"),
    content: yup.string().required("내용을 작성해주세요"),
    hashtags: yup.string(),
  })
  .required();

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];

export const ColumnEditor = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
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
    }
  }, [column_id]);

  useEffect(() => {
    if (columnData && column_id) {
      reset({
        title: columnData.title,
        content: columnData.content,
        hashtags: columnData.hashtags || "",
      });
    }
  }, [columnData, column_id, reset]);

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

          <label className="column-editor-label">내용</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="내용을 작성해주세요"
                className="column-editor-quill"
              />
            )}
          />
          {errors.content && (
            <p className="input-error-message">{errors.content.message}</p>
          )}
        </form>
      </div>
    </main>
  );
};
