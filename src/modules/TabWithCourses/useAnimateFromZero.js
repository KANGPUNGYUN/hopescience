import { useEffect, useState } from "react";

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * @param {number} target
 * @param {{ duration?: number, delay?: number, enabled?: boolean, decimals?: number }} options
 */
export const useAnimateFromZero = (
  target,
  { duration = 1000, delay = 120, enabled = true, decimals = 0 } = {}
) => {
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    const safeTarget = Number.isFinite(target) ? target : 0;

    if (!enabled) {
      setValue(safeTarget);
      return undefined;
    }

    setValue(0);
    let frameId = null;
    let delayTimer = null;

    delayTimer = window.setTimeout(() => {
      let startTime = null;

      const step = (timestamp) => {
        if (startTime === null) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = easeOutCubic(progress);
        const next = eased * safeTarget;
        setValue(
          decimals > 0
            ? Math.round(next * 10 ** decimals) / 10 ** decimals
            : Math.round(next)
        );

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setValue(safeTarget);
        }
      };

      frameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      if (delayTimer) window.clearTimeout(delayTimer);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration, delay, enabled, decimals]);

  return value;
};
