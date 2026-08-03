import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — Triggers fade-in-up animation when element enters viewport.
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0–1)
 * @param {string} options.rootMargin - Root margin
 * @param {boolean} options.once - Only trigger once (default: true)
 */
export default function useScrollReveal({
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
