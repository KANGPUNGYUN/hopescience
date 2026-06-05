import { useEffect } from "react";

/**
 * 의존성 없이 <head>의 메타 정보를 페이지별로 갱신하는 SEO 컴포넌트.
 *
 * CRA(클라이언트 렌더링) 환경이므로 JS를 실행하는 크롤러(구글봇 등)와
 * SNS 공유 미리보기에 한해 동작합니다. JS를 실행하지 않는 크롤러까지
 * 대응하려면 SSR/프리렌더링이 필요합니다.
 *
 * 언마운트 시 변경한 값을 원래대로 복원합니다.
 */
export const Seo = ({
  title,
  description,
  canonical,
  type = "website",
  image,
  jsonLd,
}) => {
  useEffect(() => {
    const metaStore = [];

    const upsertMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      const createdNew = !el;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      metaStore.push({
        el,
        createdNew,
        prev: createdNew ? null : el.getAttribute("content"),
      });
      el.setAttribute("content", content);
    };

    const prevTitle = document.title;
    if (title) document.title = title;

    if (title) {
      upsertMeta("property", "og:title", title);
      upsertMeta("name", "twitter:title", title);
    }
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }
    upsertMeta("property", "og:type", type);
    if (image) {
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:image", image);
    }

    // canonical + og:url
    let canonicalEl = null;
    let canonicalCreated = false;
    let prevCanonical = null;
    if (canonical) {
      canonicalEl = document.head.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
        canonicalCreated = true;
      } else {
        prevCanonical = canonicalEl.getAttribute("href");
      }
      canonicalEl.setAttribute("href", canonical);
      upsertMeta("property", "og:url", canonical);
    }

    let ldEl = null;
    if (jsonLd) {
      ldEl = document.createElement("script");
      ldEl.type = "application/ld+json";
      ldEl.text = JSON.stringify(jsonLd);
      document.head.appendChild(ldEl);
    }

    return () => {
      document.title = prevTitle;
      metaStore.forEach(({ el, createdNew, prev }) => {
        if (createdNew) {
          el.remove();
        } else if (prev !== null) {
          el.setAttribute("content", prev);
        }
      });
      if (canonicalEl) {
        if (canonicalCreated) {
          canonicalEl.remove();
        } else if (prevCanonical !== null) {
          canonicalEl.setAttribute("href", prevCanonical);
        }
      }
      if (ldEl) ldEl.remove();
    };
  }, [title, description, canonical, type, image, jsonLd]);

  return null;
};
