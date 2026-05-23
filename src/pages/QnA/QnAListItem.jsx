import React from "react";
import { Link } from "react-router-dom";
import { CourseCommentIcon } from "../Courses/icons/CourseDetailIcons";
import {
  formatQnaDate,
  getCommentCount,
  maskUserName,
} from "../Courses/[course_id]/courseDetailConfig";
import { getEducationReviewCategoryLabel, reviewBoardRoutes } from "./qnaBoardConfig";

export const QnAListItem = ({ inquiry }) => {
  const categoryLabel = getEducationReviewCategoryLabel(inquiry.category);

  return (
    <Link to={reviewBoardRoutes.detail(inquiry.id)} className="qna-board-list__item">
      <span className="qna-board-list__category">[{categoryLabel}]</span>
      <span className="qna-board-list__title-row">
        <span className="qna-board-list__title">{inquiry.title}</span>
        <span className="qna-board-list__comment">
          <CourseCommentIcon />
          <span>{getCommentCount(inquiry)}</span>
        </span>
      </span>
      <span className="qna-board-list__author">
        {maskUserName(inquiry.user_name)}
      </span>
      <time className="qna-board-list__date" dateTime={inquiry.created_at}>
        {formatQnaDate(inquiry.created_at)}
      </time>
      <span className="qna-board-list__views">조회 {inquiry.view_count ?? 0}</span>
    </Link>
  );
};
