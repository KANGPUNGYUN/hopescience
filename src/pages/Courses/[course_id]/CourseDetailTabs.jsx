import React from "react";
import { COURSE_DETAIL_TABS } from "./courseDetailConfig";

export const CourseDetailTabs = ({ activeTab, onTabChange }) => (
  <nav
    className="course-detail-tabs"
    aria-label="강의 상세 섹션"
  >
    <div className="course-detail-tabs__inner">
      {COURSE_DETAIL_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`course-detail-tabs__item${
            activeTab === tab.id ? " course-detail-tabs__item--active" : ""
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </nav>
);
