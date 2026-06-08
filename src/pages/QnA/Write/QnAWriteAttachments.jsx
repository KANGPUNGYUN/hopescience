import React, { useRef } from "react";
import { QnAWriteCloseIcon, QnAWritePlusIcon } from "./QnAWriteIcons";
import {
  QNA_ATTACHMENT_ACCEPT,
  QNA_ATTACHMENT_HINT,
  QNA_ATTACHMENT_MAX_BYTES,
} from "./qnaWriteConfig";

export const QnAWriteAttachments = ({ files, onAdd, onRemove }) => {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    const file = selected[0];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["jpg", "jpeg", "png"].includes(ext)) {
      alert("JPG, PNG 이미지만 첨부할 수 있습니다.");
      return;
    }
    if (file.size > QNA_ATTACHMENT_MAX_BYTES) {
      alert("파일 크기는 최대 10MB까지 가능합니다.");
      return;
    }
    onAdd([file]);
  };

  return (
    <div className="qna-write-attachments">
      <h3 className="qna-write-attachments__label">첨부 이미지</h3>
      <div className="qna-write-attachments__list">
        {files.length === 0 && (
          <button
            type="button"
            className="qna-write-attachments__add"
            aria-label="이미지 첨부"
            onClick={() => inputRef.current?.click()}
          >
            <QnAWritePlusIcon />
          </button>
        )}
        {files.map((file) => (
          <div key={file.id} className="qna-write-attachments__item">
            {file.previewUrl ? (
              <img src={file.previewUrl} alt="" className="qna-write-attachments__thumb" />
            ) : (
              <span className="qna-write-attachments__file-name">{file.name}</span>
            )}
            <button
              type="button"
              className="qna-write-attachments__remove"
              aria-label={`${file.name} 삭제`}
              onClick={() => onRemove(file.id)}
            >
              <QnAWriteCloseIcon />
            </button>
          </div>
        ))}
      </div>
      <p className="qna-write-attachments__hint">{QNA_ATTACHMENT_HINT}</p>
      <input
        ref={inputRef}
        type="file"
        accept={QNA_ATTACHMENT_ACCEPT}
        multiple
        className="qna-write-attachments__input"
        onChange={handleChange}
      />
    </div>
  );
};
