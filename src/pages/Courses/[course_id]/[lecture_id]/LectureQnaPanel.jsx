import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PaginationNav } from "../../../../components/PaginationNav";
import {
  CourseCommentIcon,
  CourseViewIcon,
} from "../../icons/CourseDetailIcons";
import {
  formatQnaDate,
  getCommentCount,
  maskUserName,
} from "../courseDetailConfig";
import { LECTURE_QNA_POSTS_PER_PAGE } from "./lecturePageConfig";

export const LectureQnaPanel = ({ inquiries = [], isLoading }) => {
  const { course_id, lecture_id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const sorted = useMemo(
    () =>
      [...inquiries].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ),
    [inquiries]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / LECTURE_QNA_POSTS_PER_PAGE));
  const showPagination = sorted.length > LECTURE_QNA_POSTS_PER_PAGE;
  const currentPosts = sorted.slice(
    (currentPage - 1) * LECTURE_QNA_POSTS_PER_PAGE,
    currentPage * LECTURE_QNA_POSTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [lecture_id, inquiries.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="lecture-qna">
      <Link
        to={`/courses/${course_id}/${lecture_id}/new`}
        className="lecture-qna__write"
      >
        글쓰기
      </Link>

      <div className="lecture-qna__list">
        {isLoading ? (
          <p className="lecture-qna__empty">불러오는 중...</p>
        ) : currentPosts.length === 0 ? (
          <p className="lecture-qna__empty">아직 작성된 질문이 없습니다.</p>
        ) : (
          currentPosts.map((post) => (
            <Link
              key={post.id}
              to={`/courses/${course_id}/${lecture_id}/${post.id}`}
              className="lecture-qna__item"
            >
              <p className="lecture-qna__item-title">{post.title}</p>
              <p className="lecture-qna__item-meta">
                {maskUserName(post.user_name)} · {formatQnaDate(post.created_at)}
              </p>
              <div className="lecture-qna__item-stats">
                <span className="lecture-qna__stat">
                  <CourseViewIcon />
                  {post.view_count ?? 0}
                </span>
                <span className="lecture-qna__stat">
                  <CourseCommentIcon />
                  {getCommentCount(post)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {showPagination && (
        <PaginationNav
          className="lecture-qna__pagination"
          ariaLabel="강의 QnA 페이지"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePage}
        />
      )}
    </div>
  );
};
