import React, { useState, useEffect } from "react";
import "./Post.css";
import { Link } from "../../components/Link";
import { Button } from "../../components/Button";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { inquiry, courseInquiry, auth } from "../../store";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AvatorIcon from "../../icons/avatar-22-2.svg"
import chatIcon from "../../icons/f-chat.svg"
import viewIcon from "../../icons/view.svg"

const createCommentSchema = yup
  .object({
    commentContent: yup
      .string()
      .required("댓글을 입력해주세요")
      .min(3, "댓글은 최소 3글자 이상 입력해야 합니다."),
  })
  .required();

export const Post = () => {
  let { inquiry_id, course_id, lecture_id, course_inquiry_id } = useParams();
  const location = useLocation();
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
  const {
    isCourseInquiryLoading,
    getCourseInquiry,
    deleteCourseInquiry,
    createCourseComment,
    updateCourseComment,
    deleteCourseComment,
    courseQnA,
    clearCourseQnA,
  } = courseInquiry((state) => ({
    isCourseInquiryLoading: state.isLoading,
    getCourseInquiry: state.getCourseInquiry,
    deleteCourseInquiry: state.deleteCourseInquiry,
    createCourseComment: state.createCourseComment,
    updateCourseComment: state.updateCourseComment,
    deleteCourseComment: state.deleteCourseComment,
    courseQnA: state.courseQnA,
    clearCourseQnA: state.clearCourseQnA,
  }));
  const { refreshAccessToken } = auth((state) => ({
    refreshAccessToken: state.refreshAccessToken,
  }));
  const data = sessionStorage.getItem("auth-storage") || null;
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();
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

  // console.log(myUserId, !!myUserId)

  useEffect(() => {
    if (inquiry_id) {
      clearCourseQnA();
      getInquiry(inquiry_id);
    } else if (course_id && course_inquiry_id) {
      clearQnA();
      getCourseInquiry(course_id, course_inquiry_id);
    }
  }, [getInquiry, clearCourseQnA, getCourseInquiry, clearQnA]);

  const onSubmit = async (data) => {
    if (myUserId) {
      const { accessToken, refreshToken } = auth.getState();
      if (location.pathname === `/QnA/${inquiry_id}`) {
        await createComment(inquiry_id, myUserId, data.commentContent).then(
          () => {
            clearCourseQnA();
            getInquiry(inquiry_id);
          }
        );
      } else {
        await createCourseComment(
          course_id,
          course_inquiry_id,
          data.commentContent,
          accessToken
        )
          .then(() => {
            clearQnA();
            getCourseInquiry(course_id, course_inquiry_id);
          })
          .catch(async (error) => {
            if (error.response.status === 401) {
              await refreshAccessToken(refreshToken);
              return onSubmit(data); // 재시도
            }
            throw error;
          });
      }
      resetCreate();
    } else {
      alert("로그인이 필요한 작업입니다.");
    }
  };

  const handleCommentChange = (e, commentId) => {
    setValue(`commentContent${commentId}`, e.target.value);
  };

  const handleEditComment = (comment) => {
    setEditMode(comment.id);
    setValue(`commentContent${comment.id}`, comment.content);
  };

  const handleCancel = () => {
    setEditMode(null);
    resetEdit();
  };

  const handleSaveComment = async (comment) => {
    if (editMode) {
      const updatedContent = getValues(`commentContent${comment.id}`);
      if (location.pathname === `/QnA/${inquiry_id}`) {
        await updateComment(comment.id, updatedContent);
        clearCourseQnA();
        getInquiry(inquiry_id);
      } else {
        await updateCourseComment(
          course_id,
          course_inquiry_id,
          comment.id,
          updatedContent
        );
        clearQnA();
        getCourseInquiry(course_id, course_inquiry_id);
      }
      setEditMode(null);
    }
  };

  const handleDeleteComment = async (comment_id) => {
    if (location.pathname === `/QnA/${inquiry_id}`) {
      await deleteComment(comment_id);
      clearCourseQnA();
      getInquiry(inquiry_id);
    } else {
      await deleteCourseComment(course_id, course_inquiry_id, comment_id);
      clearQnA();
      getCourseInquiry(course_id, course_inquiry_id);
    }
  };

  return (
    <main className="post-detail-page-background">
      <div className="post-detail-page">
        {isLoading || isCourseInquiryLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="post-header">
              <div className="post-info-wrap">
                <div className="post-category">
                  {QnA?.category || courseQnA?.category}
                </div>
                <h2 className="post-title">{QnA?.title || courseQnA?.title}</h2>
                <div className="post-info">
                  <span className="post-info-user">
                    <img src={AvatorIcon} alt="사용자 이미지" />{" "}
                    {QnA?.user_name || courseQnA?.user_name}
                  </span>
                  <span>
                    {new Date(
                      QnA?.created_at || courseQnA?.created_at
                    ).toLocaleDateString("ko-KR")}
                  </span>
                  <span>
                    <img src={chatIcon} alt="댓글 수" />{" "}
                    {QnA?.comments?.length || courseQnA?.comments?.length || 0}
                  </span>
                  <span>
                    <img src={viewIcon} alt="조회 수" />{" "}
                    {QnA?.view_count || courseQnA?.view_count}
                  </span>
                </div>
              </div>
              <div className="post-actions">
                <Link
                  to={
                    location.pathname === `/QnA/${inquiry_id}`
                      ? "/QnA"
                      : `/courses/${course_id}/${lecture_id}`
                  }
                  label="목록으로"
                  style={{ width: "105px", height: "36px", fontSize: "14px" }}
                />
                {myUserId && (myUserId === QnA?.user_id ||
                  myUserId === courseQnA?.user_id) && (
                  <>
                    <Link
                      label="수정하기"
                      to={
                        location.pathname === `/QnA/${inquiry_id}`
                          ? `/QnA/${QnA?.id}/edit`
                          : `/courses/${course_id}/${lecture_id}/${course_inquiry_id}/edit`
                      }
                      style={{
                        width: "105px",
                        height: "36px",
                        fontSize: "14px",
                        marginLeft: "10px",
                      }}
                    />
                    <Button
                      label="삭제하기"
                      variant="danger"
                      style={{
                        width: "105px",
                        height: "36px",
                        fontSize: "14px",
                      }}
                      onClick={() => setShowModal(true)}
                    />
                  </>
                )}
              </div>
            </div>

            <pre className="post-content">
              {QnA?.content || courseQnA?.content}
            </pre>

            <section className="comments-section">
              <div className="comments-section-title">댓글</div>
              {QnA?.comments?.length > 0 || courseQnA?.comments?.length > 0
                ? (QnA?.comments || courseQnA?.comments)
                    .slice()
                    .sort((a, b) => a.id - b.id)
                    .map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-item-side">
                          <div className="comment-item-header">
                            <img
                              className="comment-item-image"
                              src={AvatorIcon}
                              alt="사용자 이미지"
                            />
                            <div className="comment-info">
                              <div className="comment-author">
                                {comment.user_name}
                              </div>
                              <div className="comment-date">
                                {new Date(
                                  comment.updated_at
                                ).toLocaleDateString("ko-KR")}
                              </div>
                            </div>
                          </div>
                          {editMode === comment.id ? (
                            <form
                              onSubmit={handleSubmitEdit(() =>
                                handleSaveComment(comment)
                              )}
                              className="comment-form"
                            >
                              <textarea
                                {...registerEdit(`commentContent${comment.id}`)}
                                className="comment-textarea"
                                wrap="hard"
                                onChange={(e) =>
                                  handleCommentChange(e, comment.id)
                                }
                              />
                              <p className="input-error-message">
                                {errorsEdit.commentContent?.message}
                              </p>
                              <div className="comment-buttons">
                                <Button
                                  type="submit"
                                  label="저장하기"
                                  style={{
                                    width: "105px",
                                    height: "36px",
                                    fontSize: "14px",
                                  }}
                                />
                                <Button
                                  onClick={handleCancel}
                                  label="취소"
                                  style={{
                                    width: "105px",
                                    height: "36px",
                                    fontSize: "14px",
                                  }}
                                />
                              </div>
                            </form>
                          ) : (
                            <>
                              <p className="comment-content">
                                {comment.content}
                              </p>
                              {myUserId && myUserId === comment.user_id && (
                                <div className="comment-buttons">
                                  <Button
                                    onClick={() => handleEditComment(comment)}
                                    label="수정하기"
                                    style={{
                                      width: "105px",
                                      height: "36px",
                                      fontSize: "14px",
                                    }}
                                  />
                                  <Button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    label="삭제하기"
                                    variant="danger"
                                    style={{
                                      width: "105px",
                                      height: "36px",
                                      fontSize: "14px",
                                    }}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                : ""}
              <form
                onSubmit={handleSubmitCreate(onSubmit)}
                className="comment-form"
              >
                <textarea
                  {...registerCreate("commentContent")}
                  placeholder="댓글을 입력하세요"
                  className="comment-textarea"
                  wrap="hard"
                />
                <p className="input-error-message">
                  {errorsCreate.commentContent?.message}
                </p>
                <Button
                  label="댓글달기"
                  style={{
                    width: "105px",
                    height: "36px",
                    fontSize: "14px",
                    marginTop: "12px",
                    backgroundColor: "transparent",
                    border: "1px solid #dee1e6",
                  }}
                  type="submit"
                />
              </form>
            </section>
          </>
        )}
        <Modal
          modalTitle="문의 삭제"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            location.pathname === `/QnA/${inquiry_id}`
              ? deleteInquiry(inquiry_id)
              : deleteCourseInquiry(course_id, course_inquiry_id);
            setShowModal(false);
            location.pathname === `/QnA/${inquiry_id}`
              ? navigate("/QnA")
              : navigate(`/courses/${course_id}`);
          }}
          confirmLabel="삭제"
        >
          <p>정말 문의한 내용을 삭제하시겠습니까?</p>
        </Modal>
      </div>
    </main>
  );
};
