'use client';

import { useCallback, useEffect, useState } from 'react';

export interface TextSelection {
  text: string;
  rect: DOMRect;
}

const MIN_LENGTH = 2;
const EXCLUDED =
  'pre, code, kbd, samp, table, button, a, input, textarea, select, [data-no-select]';

function isInsideExcluded(node: Node | null, root: Element): boolean {
  let element = node instanceof Element ? node : (node?.parentElement ?? null);

  while (element && element !== root) {
    if (element.matches(EXCLUDED)) return true;
    element = element.parentElement;
  }

  return false;
}

export function useTextSelection(rootSelector: string) {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  const compute = useCallback((): TextSelection | null => {
    const active = window.getSelection();
    if (!active || active.isCollapsed || active.rangeCount === 0) return null;

    const text = active.toString().trim();
    if (text.length < MIN_LENGTH) return null;

    const root = document.querySelector(rootSelector);
    if (!root) return null;

    const range = active.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return null;

    if (
      isInsideExcluded(range.startContainer, root) ||
      isInsideExcluded(range.endContainer, root)
    ) {
      return null;
    }

    if (range.cloneContents().querySelector(EXCLUDED)) return null;

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;

    return { text, rect };
  }, [rootSelector]);

  const clear = useCallback(() => setSelection(null), []);

  useEffect(() => {
    const commit = () => setSelection(compute());
    const commitLater = () => window.setTimeout(commit, 0);

    const onSelectionChange = () => {
      const active = window.getSelection();
      if (!active || active.isCollapsed) setSelection(null);
    };

    document.addEventListener('pointerup', commitLater);
    document.addEventListener('keyup', commitLater);
    document.addEventListener('selectionchange', onSelectionChange);
    window.addEventListener('scroll', commit, { passive: true });
    window.addEventListener('resize', commit);

    return () => {
      document.removeEventListener('pointerup', commitLater);
      document.removeEventListener('keyup', commitLater);
      document.removeEventListener('selectionchange', onSelectionChange);
      window.removeEventListener('scroll', commit);
      window.removeEventListener('resize', commit);
    };
  }, [compute]);

  return { selection, clear };
}
