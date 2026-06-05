import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { column } from "../../store";
import "./HomeFaq.css";
import {
  HOME_FAQ_FETCH_LIMIT,
  HOME_FAQ_FETCH_SKIP,
  HOME_FAQ_FETCH_SORT,
  mapColumnToHomeFaqItem,
} from "./homeFaqConfig";
import { FaqArrowRightIcon, FaqMoreIcon } from "./HomeFaqIcons";

export const HomeFaq = () => {
  const { columns, isLoading, getColumns } = column((state) => ({
    columns: state.columns,
    isLoading: state.isLoading,
    getColumns: state.getColumns,
  }));

  useEffect(() => {
    getColumns(HOME_FAQ_FETCH_SKIP, HOME_FAQ_FETCH_LIMIT, HOME_FAQ_FETCH_SORT);
  }, [getColumns]);

  // 공유 스토어(FAQ 목록 페이지는 최대 500건 조회)에 항목이 더 쌓여 있어도
  // 메인에서는 항상 최신순 상위 3건만 노출한다.
  const items = useMemo(
    () =>
      (columns ?? []).slice(0, HOME_FAQ_FETCH_LIMIT).map(mapColumnToHomeFaqItem),
    [columns]
  );

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

        <div className="home-faq__list">
          {isLoading && items.length === 0 ? (
            <p className="home-faq__loading">질문을 불러오는 중입니다.</p>
          ) : items.length === 0 ? null : (
            items.map((item, index) => (
              <Link
                key={item.id}
                to={`/faq/${item.id}`}
                className={`home-faq__item${
                  index === 0 ? " home-faq__item--first" : ""
                }`}
              >
                <span className="home-faq__number">Q{index + 1}</span>
                <span className="home-faq__question">{item.question}</span>
                <span className="home-faq__arrow" aria-hidden>
                  <FaqArrowRightIcon />
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
