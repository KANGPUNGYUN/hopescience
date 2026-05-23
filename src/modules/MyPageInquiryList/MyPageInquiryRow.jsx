import React, { useMemo, useState } from "react";
import { FaqChevronIcon } from "../../components/HomeFaq/HomeFaqIcons";
import { formatQnaDate } from "../../pages/Courses/[course_id]/courseDetailConfig";
import { isHtmlContent } from "../../pages/QnA/Write/qnaWriteQuill";
import { MyPageInquiryExpandIcon } from "./MyPageInquiryIcons";
import { MyPageInquiryImageModal } from "./MyPageInquiryImageModal";
import {
  extractImageUrls,
  formatCategoryLabel,
  getCenterAnswerComment,
  getInquiryStatus,
  stripHtml,
} from "./myPageInquiryConfig";

export const MyPageInquiryRow = ({ inquiry, isOpen, onToggle, onDelete }) => {
  const [previewSrc, setPreviewSrc] = useState(null);

  const status = getInquiryStatus(inquiry);
  const dateLabel = formatQnaDate(inquiry.created_at);
  const categoryLabel = formatCategoryLabel(inquiry.category);
  const plainBody = useMemo(() => stripHtml(inquiry.content), [inquiry.content]);
  const imageUrls = useMemo(
    () => extractImageUrls(inquiry.content),
    [inquiry.content]
  );
  const answerComment = useMemo(
    () => getCenterAnswerComment(inquiry),
    [inquiry.comments]
  );
  const answerImages = useMemo(
    () => extractImageUrls(answerComment?.content),
    [answerComment?.content]
  );
  const answerPlain = useMemo(
    () => stripHtml(answerComment?.content),
    [answerComment?.content]
  );

  const handleDelete = (event) => {
    event.stopPropagation();
    if (!window.confirm("이 문의를 삭제할까요?")) return;
    onDelete(inquiry.id);
  };

  return (
    <li
      className={`mypage-inquiry-row${
        isOpen ? " mypage-inquiry-row--open" : ""
      }`}
    >
      <div className="mypage-inquiry-row__head">
        <button
          type="button"
          className="mypage-inquiry-row__toggle"
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          <span className="mypage-inquiry-row__meta-line">
            <time className="mypage-inquiry-row__date" dateTime={inquiry.created_at}>
              {dateLabel}
            </time>
            {categoryLabel ? (
              <span className="mypage-inquiry-row__category">{categoryLabel}</span>
            ) : null}
          </span>
          <span className="mypage-inquiry-row__title">{inquiry.title}</span>
          <span
            className={`mypage-inquiry-row__status mypage-inquiry-row__status--${status}`}
          >
            {status === "answered" ? "답변 완료" : "답변 대기"}
          </span>
        </button>
        <button
          type="button"
          className="mypage-inquiry-row__delete"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>

      {isOpen ? (
        <div className="mypage-inquiry-row__panel">
          {isHtmlContent(inquiry.content) ? (
            <div
              className="mypage-inquiry-row__body mypage-inquiry-row__body--html"
              dangerouslySetInnerHTML={{ __html: inquiry.content }}
            />
          ) : (
            <p className="mypage-inquiry-row__body">{plainBody}</p>
          )}

          {imageUrls.length > 0 ? (
            <ul className="mypage-inquiry-row__images" aria-label="문의 첨부 이미지">
              {imageUrls.map((url) => (
                <li key={url} className="mypage-inquiry-row__image-item">
                  <img src={url} alt="" className="mypage-inquiry-row__thumb" />
                  <button
                    type="button"
                    className="mypage-inquiry-row__expand"
                    aria-label="이미지 확대해서 보기"
                    onClick={() => setPreviewSrc(url)}
                  >
                    <MyPageInquiryExpandIcon />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {status === "answered" && answerComment ? (
            <div className="mypage-inquiry-row__answer">
              <span className="mypage-inquiry-row__answer-label">답변</span>
              <div className="mypage-inquiry-row__answer-content">
                {isHtmlContent(answerComment.content) ? (
                  <div
                    className="mypage-inquiry-row__answer-body mypage-inquiry-row__answer-body--html"
                    dangerouslySetInnerHTML={{ __html: answerComment.content }}
                  />
                ) : (
                  <p className="mypage-inquiry-row__answer-body">{answerPlain}</p>
                )}
                {answerImages.length > 0 ? (
                  <ul
                    className="mypage-inquiry-row__images mypage-inquiry-row__images--answer"
                    aria-label="답변 첨부 이미지"
                  >
                    {answerImages.map((url) => (
                      <li key={url} className="mypage-inquiry-row__image-item">
                        <img src={url} alt="" className="mypage-inquiry-row__thumb" />
                        <button
                          type="button"
                          className="mypage-inquiry-row__expand"
                          aria-label="이미지 확대해서 보기"
                          onClick={() => setPreviewSrc(url)}
                        >
                          <MyPageInquiryExpandIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {previewSrc ? (
        <MyPageInquiryImageModal
          src={previewSrc}
          onClose={() => setPreviewSrc(null)}
        />
      ) : null}
    </li>
  );
};
