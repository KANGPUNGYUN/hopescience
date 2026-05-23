import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Header, Footer } from "../../../components";
import { Modal } from "../../../modules/Modal";
import { inquiry } from "../../../store";
import {
  formatQnaDate,
  maskUserName,
} from "../../Courses/[course_id]/courseDetailConfig";
import { QnADetailHero } from "./QnADetailHero";
import { QnADetailComment } from "./QnADetailComment";
import { isCenterComment } from "./qnaDetailConfig";
import { isHtmlContent } from "../Write/qnaWriteQuill";
import { EducationReviewComingSoonModal } from "../EducationReviewComingSoonModal";
import { useEducationReviewComingSoon } from "../useEducationReviewComingSoon";
import { reviewBoardRoutes } from "../qnaBoardConfig";
import "./style.css";

const createCommentSchema = yup
  .object({
    commentContent: yup
      .string()
      .required("댓글을 입력해주세요")
      .min(3, "댓글은 최소 3글자 이상 입력해야 합니다."),
  })
  .required();

function getCommentVariant(comment, myUserId) {
  if (isCenterComment(comment)) return "center";
  if (myUserId && myUserId === comment.user_id) return "mine";
  return "default";
}

export const QnADetail = () => {
  const { review_id } = useParams();
  const navigate = useNavigate();
  const { isApiEnabled, isComingSoonOpen, closeComingSoon } =
    useEducationReviewComingSoon();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [openMenuCommentId, setOpenMenuCommentId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef(null);

  const {
    isLoading,
    getInquiry,
    deleteInquiry,
    createComment,
    updateComment,
    deleteComment,
    QnA,
    clearQnA,
  } = inquiry((state) => ({
    isLoading: state.isLoading,
    getInquiry: state.getInquiry,
    deleteInquiry: state.deleteInquiry,
    createComment: state.createComment,
    updateComment: state.updateComment,
    deleteComment: state.deleteComment,
    QnA: state.QnA,
    clearQnA: state.clearQnA,
  }));

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  const isOwner = myUserId && myUserId === QnA?.user_id;

  const sortedComments = useMemo(() => {
    if (!QnA?.comments?.length) return [];
    return [...QnA.comments].sort((a, b) => a.id - b.id);
  }, [QnA?.comments]);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm({
    resolver: yupResolver(createCommentSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    getValues,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm({});

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isApiEnabled) return;
    clearQnA();
    getInquiry(review_id);
  }, [isApiEnabled, review_id, getInquiry, clearQnA]);

  useEffect(() => {
    if (!contentRef.current || !QnA?.content) return;
    const links = contentRef.current.querySelectorAll("a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      const href = link.getAttribute("href");
      if (href && !/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) {
        link.setAttribute("href", `https://${href}`);
      }
    });
  }, [QnA?.content]);

  useEffect(() => {
    if (!openMenuCommentId) return undefined;
    const close = (e) => {
      if (e.target.closest(".qna-detail-comment__menu")) return;
      setOpenMenuCommentId(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuCommentId]);

  const onSubmitComment = async (data) => {
    if (!myUserId) {
      alert("로그인이 필요한 작업입니다.");
      return;
    }
    await createComment(review_id, myUserId, data.commentContent);
    resetCreate();
    getInquiry(review_id);
  };

  const handleEditStart = (comment) => {
    setEditMode(comment.id);
    setValue(`commentContent${comment.id}`, comment.content);
    setOpenMenuCommentId(null);
  };

  const handleEditCancel = () => {
    setEditMode(null);
    resetEdit();
  };

  const handleSaveComment = async (comment) => {
    const updatedContent = getValues(`commentContent${comment.id}`);
    await updateComment(comment.id, updatedContent);
    setEditMode(null);
    getInquiry(review_id);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    getInquiry(review_id);
  };

  const handleDeleteInquiry = async () => {
    await deleteInquiry(review_id);
    setShowModal(false);
    navigate(reviewBoardRoutes.list);
  };

  return (
    <div className="qna-detail-page-shell">
      <Header
        variant={isMobile ? "solid" : "dark"}
        mobileTitle={isMobile ? "고객 후기 상세" : undefined}
        onMobileClose={isMobile ? () => navigate(reviewBoardRoutes.list) : undefined}
      />

      <main className="qna-detail-page">
        <QnADetailHero />

        <div className="qna-detail-page__content">
          <div className="qna-detail-page__inner">
            {!isApiEnabled ? (
              <p className="qna-detail-page__status" role="status">
                고객 후기 서비스를 준비하고 있습니다.
              </p>
            ) : isLoading ? (
              <p className="qna-detail-page__status">불러오는 중...</p>
            ) : !QnA ? (
              <p className="qna-detail-page__status">게시글을 찾을 수 없습니다.</p>
            ) : (
              <>
                <article className="qna-detail-article">
                  <header className="qna-detail-article__header">
                    {QnA.category && (
                      <span className="qna-detail-article__category">
                        {QnA.category}
                      </span>
                    )}
                    <h2 className="qna-detail-article__title">{QnA.title}</h2>
                    <div className="qna-detail-article__meta">
                      <span>{maskUserName(QnA.user_name)}</span>
                      <span className="qna-detail-article__meta-divider" aria-hidden>
                        |
                      </span>
                      <time dateTime={QnA.created_at}>
                        {formatQnaDate(QnA.created_at)}
                      </time>
                      <span className="qna-detail-article__meta-divider" aria-hidden>
                        |
                      </span>
                      <span>조회수 : {QnA.view_count ?? 0}</span>
                    </div>
                  </header>

                  {isHtmlContent(QnA.content) ? (
                    <div
                      ref={contentRef}
                      className="qna-detail-article__body qna-detail-article__body--html"
                      dangerouslySetInnerHTML={{ __html: QnA.content }}
                    />
                  ) : (
                    <pre className="qna-detail-article__body">{QnA.content}</pre>
                  )}
                </article>

                <section className="qna-detail-comments" aria-labelledby="qna-detail-comments-title">
                  <h3 id="qna-detail-comments-title" className="qna-detail-comments__title">
                    댓글
                  </h3>

                  <div className="qna-detail-comments__list">
                    {sortedComments.length === 0 ? (
                      <p className="qna-detail-comments__empty">등록된 댓글이 없습니다.</p>
                    ) : (
                      sortedComments.map((comment) => {
                        const variant = getCommentVariant(comment, myUserId);
                        const isEditing = editMode === comment.id;

                        return (
                          <QnADetailComment
                            key={comment.id}
                            comment={comment}
                            variant={variant}
                            isEditing={isEditing}
                            editRegister={registerEdit(
                              `commentContent${comment.id}`
                            )}
                            editError={
                              errorsEdit[`commentContent${comment.id}`]?.message
                            }
                            onEditStart={() => handleEditStart(comment)}
                            onEditSave={handleSubmitEdit(() =>
                              handleSaveComment(comment)
                            )}
                            onEditCancel={handleEditCancel}
                            onDelete={() => handleDeleteComment(comment.id)}
                            menuOpen={openMenuCommentId === comment.id}
                            onMenuToggle={(e) => {
                              e.stopPropagation();
                              setOpenMenuCommentId((prev) =>
                                prev === comment.id ? null : comment.id
                              );
                            }}
                            onMenuClose={() => setOpenMenuCommentId(null)}
                          />
                        );
                      })
                    )}
                  </div>

                  <form
                    className="qna-detail-comments__form"
                    onSubmit={handleSubmitCreate(onSubmitComment)}
                  >
                    <textarea
                      {...registerCreate("commentContent")}
                      className="qna-detail-comments__textarea"
                      placeholder="댓글을 작성해주세요."
                      rows={4}
                    />
                    {errorsCreate.commentContent && (
                      <p className="qna-detail-comments__error">
                        {errorsCreate.commentContent.message}
                      </p>
                    )}
                    <div className="qna-detail-comments__form-actions">
                      <button type="submit" className="qna-detail-comments__submit">
                        등록
                      </button>
                    </div>
                  </form>
                </section>

                <div className="qna-detail-actions">
                  <Link to={reviewBoardRoutes.list} className="qna-detail-actions__list">
                    목록보기
                  </Link>
                  {isOwner && (
                    <>
                      <Link
                        to={reviewBoardRoutes.edit(QnA.id)}
                        className="qna-detail-actions__edit"
                      >
                        수정
                      </Link>
                      <button
                        type="button"
                        className="qna-detail-actions__delete"
                        onClick={() => setShowModal(true)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <Modal
        modalTitle="고객 후기 삭제"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteInquiry}
        confirmLabel="삭제"
      >
        <p>정말 작성한 고객 후기를 삭제하시겠습니까?</p>
      </Modal>

      <EducationReviewComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={closeComingSoon}
      />
    </div>
  );
};
