import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { QNA_QUILL_FORMATS, QNA_QUILL_MODULES } from "./qnaWriteQuill";

export const QnAWriteEditor = ({ value, onChange, error }) => (
  <div className="qna-write-editor">
    <ReactQuill
      theme="snow"
      value={value ?? ""}
      onChange={onChange}
      modules={QNA_QUILL_MODULES}
      formats={QNA_QUILL_FORMATS}
      placeholder="내용을 입력해주세요"
      className="qna-write-quill"
    />
    {error && <p className="qna-write-form__error">{error}</p>}
  </div>
);
