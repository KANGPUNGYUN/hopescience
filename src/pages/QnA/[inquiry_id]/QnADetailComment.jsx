import React from "react";
import { QnADetailAvatarIcon, QnADetailDotsIcon } from "./QnADetailIcons";
import { QnADetailReply } from "./QnADetailReply";
import { formatQnaDateTime, getReplyVariant, sortCommentReplies } from "./qnaDetailConfig";

export const QnADetailComment = ({
  comment,
  variant,
  myUserId,
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
  showReplyButton,
  isReplyFormOpen,
  onReplyOpen,
  onReplyClose,
  onReplySubmit,
  replyRegister,
  replyError,
  sortedReplies,
  editReplyId,
  openReplyMenuId,
  onReplyMenuToggle,
  onReplyMenuClose,
  onReplyEditStart,
  onReplyEditSave,
  onReplyEditCancel,
  onReplyDelete,
  getReplyEditRegister,
  getReplyEditError,
}) => {
  const dateLabel = formatQnaDateTime(comment.updated_at || comment.created_at);
  const replies = sortedReplies ?? sortCommentReplies(comment.replies);

  return (
    <article
      className={`qna-detail-comment qna-detail-comment--${variant}${
        isEditing ? " qna-detail-comment--editing" : ""
      }`}
    >
      {variant !== "center" && (
        <span className="qna-detail-comment__avatar" aria-hidden>
          <QnADetailAvatarIcon />
        </span>
      )}

      <div className="qna-detail-comment__body">
        <div className="qna-detail-comment__head">
          <div className="qna-detail-comment__author-wrap">
            <span className="qna-detail-comment__author">{comment.user_name}</span>
            {variant === "mine" && (
              <span className="qna-detail-comment__badge">나의 댓글</span>
            )}
          </div>
          <time className="qna-detail-comment__date" dateTime={comment.updated_at}>
            {dateLabel}
          </time>
          {variant === "mine" ? (
            <div className="qna-detail-comment__menu">
              <button
                type="button"
                className="qna-detail-comment__menu-btn"
                aria-label="댓글 메뉴"
                aria-expanded={menuOpen}
                onClick={onMenuToggle}
              >
                <QnADetailDotsIcon />
              </button>
              {menuOpen && (
                <div className="qna-detail-comment__menu-panel" role="menu">
                  <button type="button" role="menuitem" onClick={onEditStart}>
                    수정하기
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="qna-detail-comment__menu-delete"
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
          ) : variant === "default" ? (
            <button type="button" className="qna-detail-comment__report">
              신고
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <form className="qna-detail-comment__edit-form" onSubmit={onEditSave}>
            <textarea
              {...editRegister}
              className="qna-detail-comment__edit-textarea"
              rows={3}
            />
            {editError && (
              <p className="qna-detail-comment__error">{editError}</p>
            )}
            <div className="qna-detail-comment__edit-actions">
              <button type="submit" className="qna-detail-comment__edit-save">
                저장
              </button>
              <button
                type="button"
                className="qna-detail-comment__edit-cancel"
                onClick={onEditCancel}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="qna-detail-comment__content">{comment.content}</p>
            {showReplyButton && (
              <button
                type="button"
                className="qna-detail-comment__reply"
                onClick={isReplyFormOpen ? onReplyClose : onReplyOpen}
                aria-expanded={isReplyFormOpen}
              >
                {isReplyFormOpen ? "답글 닫기" : "답글달기"}
              </button>
            )}
          </>
        )}

        {replies.length > 0 ? (
          <div className="qna-detail-comment__replies" aria-label="답글 목록">
            {replies.map((reply) => {
              const replyVariant = getReplyVariant(reply, myUserId);
              const isReplyEditing = editReplyId === reply.id;

              return (
                <QnADetailReply
                  key={reply.id}
                  reply={reply}
                  variant={replyVariant}
                  isEditing={isReplyEditing}
                  editRegister={getReplyEditRegister?.(reply.id)}
                  editError={getReplyEditError?.(reply.id)}
                  onEditStart={() => onReplyEditStart?.(reply)}
                  onEditSave={onReplyEditSave?.(reply)}
                  onEditCancel={onReplyEditCancel}
                  onDelete={() => onReplyDelete?.(reply)}
                  menuOpen={openReplyMenuId === reply.id}
                  onMenuToggle={(e) => onReplyMenuToggle?.(e, reply.id)}
                  onMenuClose={onReplyMenuClose}
                />
              );
            })}
          </div>
        ) : null}

        {isReplyFormOpen && showReplyButton ? (
          <form
            className="qna-detail-comment__reply-form"
            onSubmit={onReplySubmit}
          >
            <textarea
              {...replyRegister}
              className="qna-detail-comment__reply-textarea"
              placeholder="댓글을 입력하세요"
              rows={2}
            />
            {replyError && (
              <p className="qna-detail-comment__error">{replyError}</p>
            )}
            <div className="qna-detail-comment__reply-form-actions">
              <button
                type="button"
                className="qna-detail-comment__reply-cancel"
                onClick={onReplyClose}
              >
                취소
              </button>
              <button type="submit" className="qna-detail-comment__reply-submit">
                등록
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </article>
  );
};
