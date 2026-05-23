import React from "react";

export const HomeEducationOperationRow = ({ item, statusLabel }) => (
  <div className="home-edu-ops__row">
    <div className="home-edu-ops__row-main">
      <span className="home-edu-ops__row-name">{item.name}</span>
      <span className="home-edu-ops__row-category">{item.category}</span>
    </div>
    <span className="home-edu-ops__row-badge">{statusLabel}</span>
    <time className="home-edu-ops__row-date" dateTime={item.date}>
      {item.date}
    </time>
  </div>
);
