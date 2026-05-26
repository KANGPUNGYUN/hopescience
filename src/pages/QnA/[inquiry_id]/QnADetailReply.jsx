import React from "react";
import { QnADetailAvatarIcon, QnADetailDotsIcon } from "./QnADetailIcons";
import { formatQnaDateTime } from "./qnaDetailConfig";

export const QnADetailReply = ({
  reply,
  variant,
  isEditing,
  editRegister,
  editError,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  menuOpen,
  onMenuToggle,
  onMenuClose,
}) => {
  const dateLabel = formatQnaDateTime(reply.updated_at || reply.created_at);

  return (
    <article
      className={`qna-detail-reply qna-detail-reply--${variant}${
        isEditing ? " qna-detail-reply--editing" : ""
      }`}
    >
      <span className="qna-detail-reply__avatar" aria-hidden>
        <QnADetailAvatarIcon />
      </span>

      <div className="qna-detail-reply__body">
        <div className="qna-detail-reply__head">
          <div className="qna-detail-reply__author-wrap">
            <span className="qna-detail-reply__author">{reply.user_name}</span>
            {variant === "mine" && (
              <span className="qna-detail-reply__badge">나의 답글</span>
            )}
          </div>
          <time className="qna-detail-reply__date" dateTime={reply.updated_at}>
            {dateLabel}
          </time>
          {variant === "mine" ? (
            <div className="qna-detail-reply__menu">
              <button
                type="button"
                className="qna-detail-reply__menu-btn"
                aria-label="답글 메뉴"
                aria-expanded={menuOpen}
                onClick={onMenuToggle}
              >
                <QnADetailDotsIcon />
              </button>
              {menuOpen && (
                <div className="qna-detail-reply__menu-panel" role="menu">
                  <button type="button" role="menuitem" onClick={onEditStart}>
                    수정하기
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="qna-detail-reply__menu-delete"
                    onClick={() => {
                      onMenuClose();
                      onDelete();
                    }}
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {isEditing ? (
          <form className="qna-detail-reply__edit-form" onSubmit={onEditSave}>
            <textarea
              {...editRegister}
              className="qna-detail-reply__edit-textarea"
              rows={2}
            />
            {editError && (
              <p className="qna-detail-reply__error">{editError}</p>
            )}
            <div className="qna-detail-reply__edit-actions">
              <button type="submit" className="qna-detail-reply__edit-save">
                저장
              </button>
              <button
                type="button"
                className="qna-detail-reply__edit-cancel"
                onClick={onEditCancel}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <p className="qna-detail-reply__content">{reply.content}</p>
        )}
      </div>
    </article>
  );
};
