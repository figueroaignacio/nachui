'use client';

import { useEffect, useState } from 'react';

/**
 * True once the silk dome has scrolled past the given offset from the top of
 * the viewport. The dome only exists in dark mode, so in light mode this never
 * flips and callers keep their solid look.
 */
export function usePastSilk(offset: number) {
  const [pastSilk, setPastSilk] = useState(false);

  useEffect(() => {
    const backdrop = document.querySelector('.page-backdrop');
    if (!backdrop || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastSilk(entry ? !entry.isIntersecting : false);
      },
      { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(backdrop);
    return () => observer.disconnect();
  }, [offset]);

  return pastSilk;
}
