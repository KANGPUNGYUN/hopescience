import React from "react";
import { Link } from "react-router-dom";
import { formatQnaDate } from "../Courses/[course_id]/courseDetailConfig";

const MAX_VISIBLE_TAGS = 1;

export const FaqListItem = ({ item }) => {
  const tags = item.hashtags ?? [];
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const extraCount = tags.length - visibleTags.length;

  return (
    <Link to={`/faq/${item.id}`} className="faq-board-list__item">
      <span className="faq-board-list__title-row">
        <span className="faq-board-list__q" aria-hidden>
          Q
        </span>
        <span className="faq-board-list__title">{item.question}</span>
      </span>

      <span className="faq-board-list__tags">
        {visibleTags.map((tag, index) => (
          <span key={`${item.id}-${index}`} className="faq-board-list__tag">
            {tag}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="faq-board-list__tag faq-board-list__tag--more">
            +{extraCount}
          </span>
        )}
      </span>

      <time className="faq-board-list__date" dateTime={item.created_at}>
        {formatQnaDate(item.created_at)}
      </time>

      <span className="faq-board-list__views">조회 {item.view_count ?? 0}</span>
    </Link>
  );
};
