import { useEffect, useRef, useState } from "react";

export const useInViewOnce = ({
  threshold = 0.25,
  rootMargin = "0px 0px -10% 0px",
} = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isInView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isInView, threshold, rootMargin]);

  return { ref, isInView };
};
