/**
 * G7b6j — 최대 maxVisible개 페이지 번호 윈도우
 */
export function getVisiblePageRange(currentPage, totalPages, maxVisible = 5) {
  if (totalPages <= 0) return [];

  const windowSize = Math.min(maxVisible, totalPages);
  let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let endPage = startPage + windowSize - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - windowSize + 1);
  }

  const pages = [];
  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }
  return pages;
}
