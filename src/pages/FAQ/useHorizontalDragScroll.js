import { useEffect, useRef } from "react";

const DRAG_THRESHOLD_PX = 6;

export function useHorizontalDragScroll() {
  const scrollRef = useRef(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
    fromButton: false,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const releaseCapture = (pointerId) => {
      try {
        if (el.hasPointerCapture(pointerId)) {
          el.releasePointerCapture(pointerId);
        }
      } catch {
        // ignore
      }
    };

    const endDrag = (pointerId) => {
      if (!dragState.current.active) return;

      const didDrag = dragState.current.dragged;
      dragState.current.active = false;
      dragState.current.dragged = false;
      dragState.current.fromButton = false;
      el.classList.remove("faq-page__filters--dragging");
      releaseCapture(pointerId);

      if (didDrag) {
        const blockClick = (event) => {
          event.preventDefault();
          event.stopPropagation();
        };
        el.addEventListener("click", blockClick, true);
        window.setTimeout(() => {
          el.removeEventListener("click", blockClick, true);
        }, 0);
      }
    };

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;

      const fromButton = Boolean(e.target.closest(".faq-page__filter"));

      dragState.current = {
        active: true,
        startX: e.clientX,
        scrollLeft: el.scrollLeft,
        dragged: false,
        fromButton,
      };

      if (!fromButton) {
        el.classList.add("faq-page__filters--dragging");
        el.setPointerCapture(e.pointerId);
      }
    };

    const onPointerMove = (e) => {
      if (!dragState.current.active) return;

      const delta = e.clientX - dragState.current.startX;
      if (Math.abs(delta) <= DRAG_THRESHOLD_PX) return;

      if (!dragState.current.dragged) {
        dragState.current.dragged = true;

        if (dragState.current.fromButton) {
          el.classList.add("faq-page__filters--dragging");
          el.setPointerCapture(e.pointerId);
        }
      }

      el.scrollLeft = dragState.current.scrollLeft - delta;
    };

    const onPointerUp = (e) => endDrag(e.pointerId);
    const onPointerCancel = (e) => endDrag(e.pointerId);

    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth + 1) return;

      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      if (delta === 0) return;

      e.preventDefault();
      el.scrollLeft += delta;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return { scrollRef };
}
