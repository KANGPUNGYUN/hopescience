/** 해시태그 문자열 → `#태그` 배열 (중복·대소문자 정규화) */
export function parseHashtags(hashtags) {
  if (!hashtags) return [];

  const seen = new Set();
  const result = [];

  String(hashtags)
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .forEach((tag) => {
      const normalized = tag.startsWith("#") ? tag : `#${tag}`;
      const key = normalized.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(normalized);
      }
    });

  return result;
}

export function mapColumnToFaqItem(column) {
  return {
    id: column.id,
    hashtags: parseHashtags(column.hashtags),
    question: column.title,
    content: column.content ?? "",
  };
}

export function buildFaqHashtagFilters(items) {
  const tagMap = new Map();

  items.forEach((item) => {
    item.hashtags.forEach((tag) => {
      const key = tag.toLowerCase();
      if (!tagMap.has(key)) {
        tagMap.set(key, tag);
      }
    });
  });

  const hashtagFilters = Array.from(tagMap.entries())
    .sort(([a], [b]) => a.localeCompare(b, "ko"))
    .map(([id, label]) => ({ id, label }));

  return [{ id: "all", label: "전체" }, ...hashtagFilters];
}

export function matchesFaqHashtagFilter(item, filterId) {
  if (filterId === "all") return true;
  return item.hashtags.some((tag) => tag.toLowerCase() === filterId);
}

export function enhanceFaqContentLinks(container) {
  if (!container) return;

  const links = container.querySelectorAll("a");
  links.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    const href = link.getAttribute("href");
    if (href && !/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) {
      link.setAttribute("href", `https://${href}`);
    }
  });
}
