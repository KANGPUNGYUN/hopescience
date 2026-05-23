import { useEffect, useState, useRef } from "react";

function preloadAsset(url) {
  if (!url) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

/**
 * @param {string[]} sources - 이미지 등 프리로드할 URL 목록
 * @returns {{ progress: number, isComplete: boolean }}
 */
export function useAssetPreload(sources = []) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const sourcesKey = JSON.stringify(sources);

  useEffect(() => {
    const urls = sources.filter(Boolean);

    if (urls.length === 0) {
      setProgress(100);
      setIsComplete(true);
      return undefined;
    }

    let cancelled = false;
    setProgress(0);
    setIsComplete(false);

    const loadAll = async () => {
      let loaded = 0;

      await Promise.all(
        urls.map(async (url) => {
          await preloadAsset(url);
          if (cancelled) return;
          loaded += 1;
          setProgress(Math.round((loaded / urls.length) * 100));
        })
      );

      if (!cancelled) {
        setProgress(100);
        setIsComplete(true);
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
    // sourcesKey로 배열 변경 감지
  }, [sourcesKey]);

  return { progress, isComplete };
}

/**
 * 외부에서 progress만 제어할 때 스무스하게 보이도록 최소 표시 시간
 */
export function useMinLoadingDuration(isComplete, minMs = 400) {
  const [canHide, setCanHide] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setCanHide(false);
  }, []);

  useEffect(() => {
    if (!isComplete) {
      setCanHide(false);
      return undefined;
    }

    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, minMs - elapsed);
    const timer = window.setTimeout(() => setCanHide(true), remaining);
    return () => window.clearTimeout(timer);
  }, [isComplete, minMs]);

  return canHide;
}
