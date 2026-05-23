import React, { useEffect, useRef } from "react";
import { FaqChevronIcon } from "../../components/HomeFaq/HomeFaqIcons";
import { enhanceFaqContentLinks } from "./faqPageUtils";

const FaqAccordionPanel = ({ item, isOpen }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      enhanceFaqContentLinks(contentRef.current);
    }
  }, [isOpen, item.content]);

  return (
    <div
      className={`faq-page__panel${isOpen ? " faq-page__panel--open" : ""}`}
      hidden={!isOpen}
    >
      <div
        ref={contentRef}
        className="faq-page__answer-content"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
    </div>
  );
};

export const FaqAccordion = ({
  items,
  openId,
  onToggle,
  emptyMessage = "등록된 질문이 없습니다.",
}) => {
  if (!items.length) {
    return <p className="faq-page__empty">{emptyMessage}</p>;
  }

  return (
    <div className="faq-page__accordion">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const displayNumber = index + 1;

        return (
          <div
            key={item.id}
            className={`faq-page__item${isOpen ? " faq-page__item--open" : ""}${
              index === 0 ? " faq-page__item--first" : ""
            }`}
          >
            <button
              type="button"
              className="faq-page__trigger"
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
            >
              <span className="faq-page__number">Q{displayNumber}</span>
              <span className="faq-page__question">{item.question}</span>
              <span className="faq-page__chevron" aria-hidden>
                <FaqChevronIcon isOpen={isOpen} />
              </span>
            </button>
            <FaqAccordionPanel item={item} isOpen={isOpen} />
          </div>
        );
      })}
    </div>
  );
};
