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
import { getCommentVariant, sortCommentReplies } from "./qnaDetailConfig";
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

const createReplySchema = yup
  .object({
    replyContent: yup
      .string()
      .required("답글을 입력해주세요")
      .min(2, "답글은 최소 2글자 이상 입력해야 합니다."),
  })
  .required();

export const QnADetail = () => {
  const { review_id } = useParams();
  const navigate = useNavigate();
  const { isApiEnabled, isComingSoonOpen, closeComingSoon } =
    useEducationReviewComingSoon();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [openMenuCommentId, setOpenMenuCommentId] = useState(null);
  const [openReplyCommentId, setOpenReplyCommentId] = useState(null);
  const [editReplyId, setEditReplyId] = useState(null);
  const [openReplyMenuId, setOpenReplyMenuId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef(null);

  const {
    isLoading,
    getReview,
    deleteReview,
    createReviewComment,
    updateReviewComment,
    deleteReviewComment,
    createReviewReply,
    updateReviewReply,
    deleteReviewReply,
    QnA,
    clearQnA,
  } = inquiry((state) => ({
    isLoading: state.isLoading,
    getReview: state.getReview,
    deleteReview: state.deleteReview,
    createReviewComment: state.createReviewComment,
    updateReviewComment: state.updateReviewComment,
    deleteReviewComment: state.deleteReviewComment,
    createReviewReply: state.createReviewReply,
    updateReviewReply: state.updateReviewReply,
    deleteReviewReply: state.deleteReviewReply,
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

  const {
    register: registerReply,
    handleSubmit: handleSubmitReply,
    reset: resetReply,
    formState: { errors: errorsReply },
  } = useForm({
    resolver: yupResolver(createReplySchema),
  });

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
    getReview(review_id);
  }, [isApiEnabled, review_id, getReview, clearQnA]);

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
    if (!openMenuCommentId && !openReplyMenuId) return undefined;
    const close = (e) => {
      if (
        e.target.closest(".qna-detail-comment__menu") ||
        e.target.closest(".qna-detail-reply__menu")
      ) {
        return;
      }
      setOpenMenuCommentId(null);
      setOpenReplyMenuId(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuCommentId, openReplyMenuId]);

  const onSubmitComment = async (data) => {
    if (!myUserId) {
      alert("로그인이 필요한 작업입니다.");
      return;
    }
    const ok = await createReviewComment(review_id, data.commentContent);
    if (!ok) return;
    resetCreate();
    getReview(review_id);
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
    if (myUserId !== comment.user_id) {
      alert("작성자만 댓글을 수정할 수 있습니다.");
      return;
    }
    const updatedContent = getValues(`commentContent${comment.id}`);
    const ok = await updateReviewComment(comment.id, updatedContent);
    if (!ok) return;
    setEditMode(null);
    getReview(review_id);
  };

  const handleDeleteComment = async (comment) => {
    if (myUserId !== comment.user_id) {
      alert("작성자만 댓글을 삭제할 수 있습니다.");
      return;
    }
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    const ok = await deleteReviewComment(comment.id);
    if (!ok) return;
    getReview(review_id);
  };

  const handleReplyOpen = (commentId) => {
    if (!myUserId) {
      alert("로그인이 필요한 작업입니다.");
      return;
    }
    setOpenReplyCommentId(commentId);
    setEditReplyId(null);
    resetReply();
  };

  const handleReplyClose = () => {
    setOpenReplyCommentId(null);
    resetReply();
  };

  const onSubmitReply = (commentId) =>
    handleSubmitReply(async (data) => {
      if (!myUserId) {
        alert("로그인이 필요한 작업입니다.");
        return;
      }
      const ok = await createReviewReply(
        review_id,
        commentId,
        data.replyContent
      );
      if (ok) {
        resetReply();
        setOpenReplyCommentId(null);
        getReview(review_id);
      }
    });

  const handleReplyEditStart = (reply) => {
    setEditReplyId(reply.id);
    setValue(`replyContent${reply.id}`, reply.content);
    setOpenReplyMenuId(null);
  };

  const handleReplyEditCancel = () => {
    setEditReplyId(null);
    resetEdit();
  };

  const handleSaveReply = async (reply) => {
    if (myUserId !== reply.user_id) {
      alert("작성자만 답글을 수정할 수 있습니다.");
      return;
    }
    const updatedContent = getValues(`replyContent${reply.id}`);
    const ok = await updateReviewReply(reply.id, updatedContent);
    if (ok) {
      setEditReplyId(null);
      getReview(review_id);
    }
  };

  const handleDeleteReply = async (reply) => {
    if (myUserId !== reply.user_id) {
      alert("작성자만 답글을 삭제할 수 있습니다.");
      return;
    }
    if (!window.confirm("이 답글을 삭제할까요?")) return;
    const ok = await deleteReviewReply(reply.id);
    if (ok) {
      if (editReplyId === reply.id) setEditReplyId(null);
      getReview(review_id);
    }
  };

  const handleDeleteReview = async () => {
    const ok = await deleteReview(review_id);
    if (!ok) return;
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

                  {QnA.image_url && (
                    <div className="qna-detail-article__cover">
                      <img
                        src={QnA.image_url}
                        alt="첨부 이미지"
                        className="qna-detail-article__cover-img"
                      />
                    </div>
                  )}

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
                        const canReply =
                          Boolean(myUserId) && variant !== "mine";

                        return (
                          <QnADetailComment
                            key={comment.id}
                            comment={comment}
                            variant={variant}
                            myUserId={myUserId}
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
                            onDelete={() => handleDeleteComment(comment)}
                            menuOpen={openMenuCommentId === comment.id}
                            onMenuToggle={(e) => {
                              e.stopPropagation();
                              setOpenMenuCommentId((prev) =>
                                prev === comment.id ? null : comment.id
                              );
                            }}
                            onMenuClose={() => setOpenMenuCommentId(null)}
                            showReplyButton={canReply}
                            isReplyFormOpen={openReplyCommentId === comment.id}
                            onReplyOpen={() => handleReplyOpen(comment.id)}
                            onReplyClose={handleReplyClose}
                            onReplySubmit={onSubmitReply(comment.id)}
                            replyRegister={registerReply("replyContent")}
                            replyError={errorsReply.replyContent?.message}
                            sortedReplies={sortCommentReplies(comment.replies)}
                            editReplyId={editReplyId}
                            openReplyMenuId={openReplyMenuId}
                            onReplyMenuToggle={(e, replyId) => {
                              e.stopPropagation();
                              setOpenReplyMenuId((prev) =>
                                prev === replyId ? null : replyId
                              );
                            }}
                            onReplyMenuClose={() => setOpenReplyMenuId(null)}
                            onReplyEditStart={handleReplyEditStart}
                            onReplyEditSave={(reply) =>
                              handleSubmitEdit(() => handleSaveReply(reply))
                            }
                            onReplyEditCancel={handleReplyEditCancel}
                            onReplyDelete={(reply) => handleDeleteReply(reply)}
                            getReplyEditRegister={(replyId) =>
                              registerEdit(`replyContent${replyId}`)
                            }
                            getReplyEditError={(replyId) =>
                              errorsEdit[`replyContent${replyId}`]?.message
                            }
                          />
                        );
                      })
                    )}
                  </div>

                  <form
                    className="qna-detail-comments__form"
                    onSubmit={handleSubmitCreate(onSubmitComment)}
                  >
                    <div className="qna-detail-comments__form-inner">
                      <textarea
                        {...registerCreate("commentContent")}
                        className="qna-detail-comments__textarea"
                        placeholder="댓글을 입력하세요"
                        rows={3}
                      />
                      <button
                        type="submit"
                        className="qna-detail-comments__submit"
                      >
                        등록
                      </button>
                    </div>
                    {errorsCreate.commentContent && (
                      <p className="qna-detail-comments__error">
                        {errorsCreate.commentContent.message}
                      </p>
                    )}
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
        onConfirm={handleDeleteReview}
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
