import { useEffect, useState } from "react";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const formatCount = (value) =>
  new Intl.NumberFormat("ko-KR").format(value);

export const useCountUp = (target, { duration = 2000, enabled = false } = {}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled || target == null) {
      setValue(0);
      return undefined;
    }

    let startTime = null;
    let frameId = null;

    const step = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const next = Math.round(easeOutCubic(progress) * target);
      setValue(next);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [target, duration, enabled]);

  return value;
};
