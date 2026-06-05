import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header, Footer, Seo } from "../../../components";
import { column } from "../../../store";
import { formatQnaDate } from "../../Courses/[course_id]/courseDetailConfig";
import { FaqHero } from "../FaqHero";
import { parseHashtags, stripHtmlToText } from "../faqPageUtils";
import "./FAQDetail.css";

export const FAQDetail = () => {
  const { column_id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const fetchedIdRef = useRef(null);

  const { isLoading, columnData, getColumn } = column((state) => ({
    isLoading: state.isLoading,
    columnData: state.column,
    getColumn: state.getColumn,
  }));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // column_id별로 한 번만 조회 (StrictMode 이중 실행·리렌더로 인한 조회수 중복 증가 방지)
  useEffect(() => {
    if (fetchedIdRef.current === column_id) return;
    fetchedIdRef.current = column_id;
    getColumn(column_id);
  }, [column_id]);

  useEffect(() => {
    if (!contentRef.current || !columnData?.content) return;
    const links = contentRef.current.querySelectorAll("a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      const href = link.getAttribute("href");
      if (href && !/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) {
        link.setAttribute("href", `https://${href}`);
      }
    });
  }, [columnData]);

  const hashtags = parseHashtags(columnData?.hashtags);

  const seo = useMemo(() => {
    if (!columnData) return null;

    const plainContent = stripHtmlToText(columnData.content);
    const description = plainContent
      ? `${plainContent.slice(0, 155)}${plainContent.length > 155 ? "…" : ""}`
      : `${columnData.title} - 희망과학 심리상담센터 자주 묻는 질문`;
    const canonical =
      typeof window !== "undefined"
        ? `${window.location.origin}/faq/${column_id}`
        : undefined;

    return {
      title: `${columnData.title} | 희망과학 자주 묻는 질문`,
      description,
      canonical,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: columnData.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: plainContent || columnData.title,
            },
          },
        ],
      },
    };
  }, [columnData, column_id]);

  return (
    <div className="faq-detail-page-shell">
      {seo && (
        <Seo
          title={seo.title}
          description={seo.description}
          canonical={seo.canonical}
          type="article"
          jsonLd={seo.jsonLd}
        />
      )}

      <Header
        variant={isMobile ? "solid" : "dark"}
        mobileTitle={isMobile ? "자주 묻는 질문" : undefined}
        onMobileClose={isMobile ? () => navigate("/faq") : undefined}
      />

      <main className="faq-detail-page">
        <FaqHero />

        <div className="faq-detail-page__content">
          <div className="faq-detail-page__inner">
            {isLoading ? (
              <p className="faq-detail-page__status">불러오는 중...</p>
            ) : !columnData ? (
              <p className="faq-detail-page__status">
                질문을 찾을 수 없습니다.
              </p>
            ) : (
              <>
                <article className="faq-detail-article">
                  <header className="faq-detail-article__header">
                    <h2 className="faq-detail-article__title">
                      {columnData.title}
                    </h2>
                    <div className="faq-detail-article__meta">
                      <time dateTime={columnData.created_at}>
                        {formatQnaDate(columnData.created_at)}
                      </time>
                      {columnData.updated_at &&
                        columnData.updated_at !== columnData.created_at && (
                          <>
                            <span
                              className="faq-detail-article__meta-divider"
                              aria-hidden
                            >
                              |
                            </span>
                            <span>
                              수정 {formatQnaDate(columnData.updated_at)}
                            </span>
                          </>
                        )}
                      <span
                        className="faq-detail-article__meta-divider"
                        aria-hidden
                      >
                        |
                      </span>
                      <span>조회수 : {columnData.view_count ?? 0}</span>
                    </div>
                  </header>

                  <div
                    ref={contentRef}
                    className="faq-detail-article__body faq-detail-article__body--html"
                    dangerouslySetInnerHTML={{ __html: columnData.content }}
                  />

                  {hashtags.length > 0 && (
                    <div className="faq-detail-article__tags">
                      {hashtags.map((tag, idx) => (
                        <span key={idx} className="faq-detail-article__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>

                <div className="faq-detail-actions">
                  <Link to="/faq" className="faq-detail-actions__list">
                    목록보기
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
