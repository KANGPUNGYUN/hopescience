const fs = require('fs-extra');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const path = require('path');

// 웹사이트 URL을 정의합니다
const baseUrl = 'https://www.xn--vb0b67vepvv2b.com';

// 정적 라우트를 정의합니다 (priority, changefreq 개별 지정 가능)
const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/courses', changefreq: 'daily', priority: 1.0 },
  { url: '/faq', changefreq: 'weekly', priority: 0.8 },
  { url: '/review', changefreq: 'daily', priority: 0.7 },
  { url: '/policy', changefreq: 'monthly', priority: 0.5 },
];

// .env에서 운영 API URL을 읽어옵니다 (dotenv 미설치 환경 대비 직접 파싱).
function readProdApiUrl() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const raw = fs.readFileSync(envPath, 'utf-8');
    const line = raw
      .split('\n')
      .find((l) => l.trim().startsWith('REACT_APP_API_URL_PROD='));
    if (!line) return null;
    return line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
  } catch {
    return null;
  }
}

// FAQ(칼럼) 상세 페이지 URL을 API에서 동적으로 수집합니다.
async function fetchFaqRoutes() {
  const apiUrl = readProdApiUrl();
  if (!apiUrl || typeof fetch !== 'function') {
    console.warn('FAQ 상세 URL 수집을 건너뜁니다 (API URL 또는 fetch 미지원).');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/columns/?skip=0&limit=1000&sort=desc`);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const items = data.items ?? [];
    return items.map((col) => ({
      url: `/faq/${col.id}`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: col.updated_at || col.created_at || undefined,
    }));
  } catch (error) {
    console.warn(`FAQ 상세 URL 수집 실패: ${error.message}`);
    return [];
  }
}

async function generateSitemap() {
  const faqRoutes = await fetchFaqRoutes();
  const links = [...staticRoutes, ...faqRoutes].map((route) => ({
    url: `${baseUrl}${route.url}`,
    changefreq: route.changefreq,
    priority: route.priority,
    ...(route.lastmod ? { lastmod: route.lastmod } : {}),
  }));

  const stream = new SitemapStream({ hostname: baseUrl });

  const xml = await streamToPromise(
    Readable.from(links).pipe(stream)
  ).then((data) => data.toString());

  // 현재 스크립트 위치에서 상대 경로로 파일을 저장합니다
  const filePath = path.join(__dirname, 'sitemap.xml');
  await fs.writeFile(filePath, xml);
  console.log(
    `Sitemap generated successfully at ${filePath} (총 ${links.length}개 URL, FAQ 상세 ${faqRoutes.length}개 포함)`
  );
}

generateSitemap();
