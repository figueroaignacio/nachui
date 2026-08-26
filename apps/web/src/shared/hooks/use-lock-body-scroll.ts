'use client';

import { useLayoutEffect } from 'react';

export function useLockBodyScroll(isLocked: boolean) {
  useLayoutEffect(() => {
    if (!isLocked) return;

    const root = document.documentElement;
    const depth = Number(root.dataset.scrollLocked ?? '0');

    if (depth === 0) {
      const gutter = window.innerWidth - root.clientWidth;
      root.dataset.scrollLockedOverflow = document.body.style.overflow;
      if (gutter > 0) root.style.paddingRight = `${gutter}px`;
      document.body.style.overflow = 'hidden';
    }
    root.dataset.scrollLocked = String(depth + 1);

    return () => {
      const remaining = Number(root.dataset.scrollLocked ?? '1') - 1;
      if (remaining > 0) {
        root.dataset.scrollLocked = String(remaining);
        return;
      }

      document.body.style.overflow = root.dataset.scrollLockedOverflow ?? '';
      root.style.paddingRight = '';
      delete root.dataset.scrollLocked;
      delete root.dataset.scrollLockedOverflow;
    };
  }, [isLocked]);
}
