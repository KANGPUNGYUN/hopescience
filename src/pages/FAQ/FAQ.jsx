import React, { useEffect, useMemo, useState } from "react";
import { Header, Footer } from "../../components";
import { column } from "../../store";
import { FaqHero } from "./FaqHero";
import { FaqFilter } from "./FaqFilter";
import { FaqAccordion } from "./FaqAccordion";
import {
  FAQ_FETCH_LIMIT,
  FAQ_FETCH_SKIP,
  FAQ_FETCH_SORT,
} from "./faqPageConfig";
import {
  buildFaqHashtagFilters,
  mapColumnToFaqItem,
  matchesFaqHashtagFilter,
} from "./faqPageUtils";
import "./style.css";

export const FAQ = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const { columns, isLoading, getColumns } = column((state) => ({
    columns: state.columns,
    isLoading: state.isLoading,
    getColumns: state.getColumns,
  }));

  useEffect(() => {
    getColumns(FAQ_FETCH_SKIP, FAQ_FETCH_LIMIT, FAQ_FETCH_SORT);
  }, [getColumns]);

  const faqItems = useMemo(
    () => (columns ?? []).map(mapColumnToFaqItem),
    [columns]
  );

  const hashtagFilters = useMemo(
    () => buildFaqHashtagFilters(faqItems),
    [faqItems]
  );

  const filteredItems = useMemo(
    () => faqItems.filter((item) => matchesFaqHashtagFilter(item, activeFilter)),
    [faqItems, activeFilter]
  );

  useEffect(() => {
    setOpenId(null);
  }, [activeFilter]);

  useEffect(() => {
    const filterIds = hashtagFilters.map((filter) => filter.id);
    if (!filterIds.includes(activeFilter)) {
      setActiveFilter("all");
    }
  }, [hashtagFilters, activeFilter]);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="faq-page-shell">
        <Header variant="dark" />

        <main className="faq-page">
          <FaqHero />

          <section className="faq-page__content" aria-label="자주 묻는 질문 목록">
            <div className="faq-page__inner">
              <FaqFilter
                filters={hashtagFilters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              {isLoading ? (
                <p className="faq-page__loading">질문 목록을 불러오는 중입니다.</p>
              ) : (
                <FaqAccordion
                  items={filteredItems}
                  openId={openId}
                  onToggle={handleToggle}
                  emptyMessage={
                    faqItems.length === 0
                      ? "등록된 질문이 없습니다."
                      : "선택한 해시태그에 해당하는 질문이 없습니다."
                  }
                />
              )}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};
