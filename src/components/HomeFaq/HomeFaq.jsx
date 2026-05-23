import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { column } from "../../store";
import { enhanceFaqContentLinks } from "../../pages/FAQ/faqPageUtils";
import "./HomeFaq.css";
import {
  HOME_FAQ_FETCH_LIMIT,
  HOME_FAQ_FETCH_SKIP,
  HOME_FAQ_FETCH_SORT,
  mapColumnToHomeFaqItem,
} from "./homeFaqConfig";
import { FaqChevronIcon, FaqMoreIcon } from "./HomeFaqIcons";

const HomeFaqPanel = ({ item, isOpen }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      enhanceFaqContentLinks(contentRef.current);
    }
  }, [isOpen, item.content]);

  return (
    <div
      className={`home-faq__panel${isOpen ? " home-faq__panel--open" : ""}`}
      hidden={!isOpen}
    >
      <div
        ref={contentRef}
        className="home-faq__answer-content"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
    </div>
  );
};

export const HomeFaq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const { columns, isLoading, getColumns } = column((state) => ({
    columns: state.columns,
    isLoading: state.isLoading,
    getColumns: state.getColumns,
  }));

  useEffect(() => {
    getColumns(HOME_FAQ_FETCH_SKIP, HOME_FAQ_FETCH_LIMIT, HOME_FAQ_FETCH_SORT);
  }, [getColumns]);

  const items = useMemo(
    () => (columns ?? []).map(mapColumnToHomeFaqItem),
    [columns]
  );

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      <div className="home-faq__inner">
        <div className="home-faq__intro">
          <p className="home-faq__label">FAQ</p>
          <h2 id="home-faq-title" className="home-faq__title">
            자주 묻는 질문
          </h2>
          <p className="home-faq__desc">
            교육 수강 및 수료증 발급 관련 자주 문의되는 내용을
            <br className="home-faq__desc-break" />
            빠르게 확인하실 수 있습니다
          </p>
          <Link to="/faq" className="home-faq__more">
            <span>더보기</span>
            <span className="home-faq__more-icon" aria-hidden>
              <FaqMoreIcon />
            </span>
          </Link>
        </div>

        <div className="home-faq__accordion">
          {isLoading && items.length === 0 ? (
            <p className="home-faq__loading">질문을 불러오는 중입니다.</p>
          ) : items.length === 0 ? null : (
            items.map((item, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={item.id}
                  className={`home-faq__item${isOpen ? " home-faq__item--open" : ""}${
                    index === 0 ? " home-faq__item--first" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="home-faq__trigger"
                    onClick={() => handleToggle(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="home-faq__number">Q{index + 1}</span>
                    <span className="home-faq__question">{item.question}</span>
                    <span className="home-faq__chevron" aria-hidden>
                      <FaqChevronIcon isOpen={isOpen} />
                    </span>
                  </button>
                  <HomeFaqPanel item={item} isOpen={isOpen} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
