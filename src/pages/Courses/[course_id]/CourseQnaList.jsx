import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PaginationNav } from "../../../components/PaginationNav";
import {
  CourseCommentIcon,
  CourseViewIcon,
} from "../icons/CourseDetailIcons";
import {
  formatQnaDate,
  getCommentCount,
  maskUserName,
} from "./courseDetailConfig";

const POSTS_PER_PAGE = 6;

export const CourseQnaList = ({
  inquiries = [],
  isLoading,
  sectionRef,
}) => {
  const { course_id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const sorted = useMemo(
    () =>
      [...inquiries].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ),
    [inquiries]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / POSTS_PER_PAGE));
  const currentPosts = sorted.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: sectionRef?.current?.offsetTop ?? 0, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="course-section-qna"
      className="course-detail-section course-detail-section--qna"
      aria-labelledby="course-qna-title"
    >
      <div className="course-detail-section__head">
        <h2 id="course-qna-title" className="course-detail-section__title">
          QnA
        </h2>
        <Link
          to={`/courses/${course_id}/1/new`}
          className="course-qna__write"
        >
          글쓰기
        </Link>
      </div>

      <div className="course-qna__list">
        {isLoading ? (
          <p className="course-qna__empty">불러오는 중...</p>
        ) : currentPosts.length === 0 ? (
          <p className="course-qna__empty">아직 작성된 질문이 없습니다.</p>
        ) : (
          currentPosts.map((post) => (
            <Link
              key={post.id}
              to={`/courses/${course_id}/1/${post.id}`}
              className="course-qna__item"
            >
              <p className="course-qna__item-title">{post.title}</p>
              <p className="course-qna__item-meta">
                {maskUserName(post.user_name)} · {formatQnaDate(post.created_at)}
              </p>
              <div className="course-qna__item-stats">
                <span className="course-qna__stat">
                  <CourseViewIcon />
                  {post.view_count ?? 0}
                </span>
                <span className="course-qna__stat">
                  <CourseCommentIcon />
                  {getCommentCount(post)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      <PaginationNav
        className="course-qna__pagination"
        ariaLabel="QnA 페이지"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePage}
      />
    </section>
  );
};
