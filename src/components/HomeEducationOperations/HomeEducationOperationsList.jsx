import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HomeEducationOperationRow } from "./HomeEducationOperationRow";
import {
  HOME_EDUCATION_OPERATIONS_ITEMS,
  HOME_EDUCATION_OPERATIONS_TICKER,
} from "./homeEducationOperationsConfig";

const { rowHeight, mobileRowHeight, intervalMs, transitionMs, loopCopies } =
  HOME_EDUCATION_OPERATIONS_TICKER;

const buildLoopItems = (copies) =>
  Array.from({ length: copies }, (_, copyIndex) =>
    HOME_EDUCATION_OPERATIONS_ITEMS.map((item) => ({
      ...item,
      loopKey: `${item.id}-copy-${copyIndex}`,
    }))
  ).flat();

const useTickerMetrics = () => {
  const [metrics, setMetrics] = useState({
    enabled: false,
    rowHeight,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const update = () => {
      const isMobile = mobileQuery.matches;
      setMetrics({
        enabled: !motionQuery.matches,
        rowHeight: isMobile ? mobileRowHeight : rowHeight,
      });
    };

    update();
    motionQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  return metrics;
};

export const HomeEducationOperationsList = ({ statusLabel }) => {
  const { enabled: tickerEnabled, rowHeight: tickerRowHeight } = useTickerMetrics();
  const itemCount = HOME_EDUCATION_OPERATIONS_ITEMS.length;
  const loopItems = useMemo(() => buildLoopItems(loopCopies), []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const resetPendingRef = useRef(false);

  const advance = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev >= itemCount) return prev;
      return prev + 1;
    });
  }, [itemCount]);

  useEffect(() => {
    if (!tickerEnabled) {
      setActiveIndex(0);
      setTransitionEnabled(true);
      resetPendingRef.current = false;
      return undefined;
    }

    const timer = window.setInterval(advance, intervalMs);
    return () => window.clearInterval(timer);
  }, [tickerEnabled, advance]);

  const handleTransitionEnd = useCallback(
    (event) => {
      if (event.propertyName !== "transform") return;
      if (!resetPendingRef.current || activeIndex !== itemCount) return;

      resetPendingRef.current = false;
      setTransitionEnabled(false);
      setActiveIndex(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    },
    [activeIndex, itemCount]
  );

  useEffect(() => {
    if (activeIndex === itemCount) {
      resetPendingRef.current = true;
    }
  }, [activeIndex, itemCount]);

  const offsetY = tickerEnabled ? activeIndex * tickerRowHeight : 0;
  const visibleItems = tickerEnabled
    ? loopItems
    : HOME_EDUCATION_OPERATIONS_ITEMS.map((item) => ({
        ...item,
        loopKey: item.id,
      }));

  return (
    <div
      className="home-edu-ops__list"
      aria-live={tickerEnabled ? "polite" : undefined}
      aria-atomic={tickerEnabled ? "true" : undefined}
    >
      <div
        className="home-edu-ops__list-track"
        style={{
          transform: `translate3d(0, -${offsetY}px, 0)`,
          transition: transitionEnabled
            ? `transform ${transitionMs}ms ease-in-out`
            : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {visibleItems.map((item) => (
          <HomeEducationOperationRow
            key={item.loopKey}
            item={item}
            statusLabel={statusLabel}
          />
        ))}
      </div>
    </div>
  );
};
