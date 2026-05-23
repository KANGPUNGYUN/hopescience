import React from "react";

export const HomeReviewCard = ({ review, featured = false }) => {
  const cardClass = featured
    ? "home-reviews__card home-reviews__card--featured"
    : "home-reviews__card";

  return (
    <article className={cardClass}>
      <p className="home-reviews__card-text">{review.review}</p>
      <footer className="home-reviews__card-footer">
        <span className="home-reviews__card-name">{review.name}</span>
        <time className="home-reviews__card-date" dateTime={review.date}>
          {review.date}
        </time>
      </footer>
    </article>
  );
};
