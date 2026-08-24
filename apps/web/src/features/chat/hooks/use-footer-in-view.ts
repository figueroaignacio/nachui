'use client';

import { useEffect, useState } from 'react';

export function useFooterInView() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('[data-site-footer]');
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry?.isIntersecting ?? false);
    });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return inView;
}
