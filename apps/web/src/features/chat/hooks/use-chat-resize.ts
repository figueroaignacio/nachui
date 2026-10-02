'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nachui-chat-width';
const MIN_WIDTH = 320;
const MAX_WIDTH = 672;
/** The page keeps at least this much room next to the panel. */
const MIN_CONTENT = 780;
/** Matches the `--chat-width` defaults in globals.css (24rem, 28rem from 96rem up). */
const WIDE_VIEWPORT = 1536;

function defaultWidth(viewport: number) {
  return viewport >= WIDE_VIEWPORT ? 448 : 384;
}

function maxWidth(viewport: number) {
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, viewport - MIN_CONTENT));
}

function clampWidth(width: number, viewport: number) {
  return Math.round(Math.min(Math.max(width, MIN_WIDTH), maxWidth(viewport)));
}

function readStoredWidth() {
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function storeWidth(width: number | null) {
  try {
    if (width === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, String(width));
  } catch {}
}

function setChatWidthVar(width: number | null) {
  const root = document.documentElement;
  if (width === null) root.style.removeProperty('--chat-width');
  else root.style.setProperty('--chat-width', `${width}px`);
}

const toPercent = (px: number, viewport: number) => (px / viewport) * 100;

/**
 * Sizes for the `Resizable` group that docks the chat. The group works in
 * percentages of the viewport, while the stored width and the `--chat-width`
 * custom property (which pushes the page) stay in pixels, so the panel keeps
 * its width when the window changes size. The group remounts on viewport
 * changes and on reset to pick up a new default size.
 */
export function useChatResize() {
  const [viewport, setViewport] = useState(() => window.innerWidth);
  const [resetCount, setResetCount] = useState(0);
  const [startWidth, setStartWidth] = useState(() =>
    clampWidth(readStoredWidth() ?? defaultWidth(window.innerWidth), window.innerWidth),
  );

  useEffect(() => {
    if (readStoredWidth() !== null) setChatWidthVar(startWidth);
  }, [startWidth]);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = window.innerWidth;
        setViewport(next);
        setStartWidth(clampWidth(readStoredWidth() ?? defaultWidth(next), next));
      });
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onLayout = useCallback(
    (sizes: number[]) => {
      const chat = sizes[1];
      if (chat === undefined) return;
      const width = clampWidth((chat / 100) * viewport, viewport);
      setChatWidthVar(width);
      storeWidth(width);
    },
    [viewport],
  );

  const reset = useCallback(() => {
    storeWidth(null);
    setChatWidthVar(null);
    setStartWidth(clampWidth(defaultWidth(window.innerWidth), window.innerWidth));
    setResetCount((count) => count + 1);
  }, []);

  const chatDefault = toPercent(startWidth, viewport);
  const chatMin = toPercent(MIN_WIDTH, viewport);
  const chatMax = toPercent(maxWidth(viewport), viewport);

  return {
    groupKey: `${viewport}-${resetCount}`,
    onLayout,
    reset,
    chat: { defaultSize: chatDefault, minSize: chatMin, maxSize: chatMax },
    page: { defaultSize: 100 - chatDefault, minSize: 100 - chatMax, maxSize: 100 - chatMin },
  };
}
