import React, { useEffect, useRef } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { Button } from "../../../components/Button";
import { column } from "../../../store";
import { useParams, useNavigate } from "react-router-dom";
import "./FAQDetail.css";

export const FAQDetail = () => {
  const { column_id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const { isLoading, columnData, getColumn, clearColumn } = column((state) => ({
    isLoading: state.isLoading,
    columnData: state.column,
    getColumn: state.getColumn,
    clearColumn: state.clearColumn,
  }));

  useEffect(() => {
    getColumn(column_id);
    return () => clearColumn();
  }, [column_id]);

  useEffect(() => {
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
  }, [columnData]);

  const extractHashtags = (hashtags) => {
    if (!hashtags) return [];
    return hashtags.split(" ").filter((tag) => tag.startsWith("#"));
  };

  return (
    <>
      <Header />
      <main className="faq-detail-background">
        <article className="faq-detail-page">
          {isLoading ? (
            <p className="faq-detail-loading">Loading...</p>
          ) : columnData ? (
            <>
              <header className="faq-detail-header">
                <h1 className="faq-detail-title">{columnData.title}</h1>
                <div className="faq-detail-meta">
                  <span>
                    작성일:{" "}
                    {new Date(columnData.created_at).toLocaleDateString("ko-KR")}
                  </span>
                  {columnData.updated_at &&
                    columnData.updated_at !== columnData.created_at && (
                      <span>
                        수정일:{" "}
                        {new Date(columnData.updated_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    )}
                </div>
              </header>

              <div
                ref={contentRef}
                className="faq-detail-content"
                dangerouslySetInnerHTML={{ __html: columnData.content }}
              />

              {columnData.hashtags && (
                <div className="faq-detail-tags">
                  {extractHashtags(columnData.hashtags).map((tag, idx) => (
                    <span key={idx} className="faq-detail-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="faq-detail-footer">
                <Button
                  label="목록으로"
                  onClick={() => navigate("/faq")}
                  style={{ width: "105px", height: "36px", fontSize: "14px" }}
                />
              </div>
            </>
          ) : (
            <p className="faq-detail-loading">칼럼을 찾을 수 없습니다.</p>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
};
