import * as React from 'react';

const TYPEAHEAD_RESET_MS = 500;

export type CollectionOrientation = 'horizontal' | 'vertical' | 'both';

interface NavigationOptions {
  orientation?: CollectionOrientation;
  rtl?: boolean;
  loop?: boolean;
}

export function getNavigationIndex(
  key: string,
  current: number,
  count: number,
  { orientation = 'vertical', rtl = false, loop = true }: NavigationOptions = {},
): number | null {
  if (count === 0) return null;

  const horizontal = orientation !== 'vertical';
  const vertical = orientation !== 'horizontal';
  const forwardKeys = [
    ...(vertical ? ['ArrowDown'] : []),
    ...(horizontal ? [rtl ? 'ArrowLeft' : 'ArrowRight'] : []),
  ];
  const backwardKeys = [
    ...(vertical ? ['ArrowUp'] : []),
    ...(horizontal ? [rtl ? 'ArrowRight' : 'ArrowLeft'] : []),
  ];

  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;

  if (forwardKeys.includes(key)) {
    if (current < 0) return 0;
    if (current >= count - 1) return loop ? 0 : count - 1;
    return current + 1;
  }

  if (backwardKeys.includes(key)) {
    if (current < 0) return count - 1;
    if (current <= 0) return loop ? count - 1 : 0;
    return current - 1;
  }

  return null;
}

export function isTypeaheadKey(event: React.KeyboardEvent | KeyboardEvent, isTyping: boolean) {
  return (
    event.key.length === 1 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    (event.key !== ' ' || isTyping)
  );
}

const defaultLabel = (item: HTMLElement) => item.textContent?.trim() ?? '';

export function useTypeahead() {
  const bufferRef = React.useRef('');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const isTyping = React.useCallback(() => bufferRef.current !== '', []);

  const search = React.useCallback(
    (
      key: string,
      items: HTMLElement[],
      current: number,
      labelOf: (item: HTMLElement) => string = defaultLabel,
    ) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = '';
      }, TYPEAHEAD_RESET_MS);
      const buffer = bufferRef.current + key.toLowerCase();
      bufferRef.current = buffer;
      const repeated = Array.from(buffer).every((char) => char === buffer[0]);
      const query = repeated ? buffer.charAt(0) : buffer;
      const start = repeated ? current + 1 : Math.max(current, 0);
      const ordered = [...items.slice(start), ...items.slice(0, start)];
      return ordered.find((item) => labelOf(item).toLowerCase().startsWith(query));
    },
    [],
  );

  return React.useMemo(() => ({ search, isTyping }), [search, isTyping]);
}
