'use client';

import * as React from 'react';

export const ARRIVE = 'animate-arrive';
export const STATUS_IN = 'animate-status';
export const ROLL_IN = 'inline-block animate-roll';
export const TOKEN_IN = 'inline-block whitespace-pre animate-token';
export const AUTO_HEIGHT =
  'overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none';

type ArrivalStore = React.RefObject<boolean>;

const ArrivalContext = React.createContext<ArrivalStore | null>(null);

const hasArrived = (store: ArrivalStore | null) => store?.current ?? false;

export function Arrivals({ children }: { children?: React.ReactNode }) {
  const store = React.useRef(false);

  React.useEffect(() => {
    store.current = true;
  }, []);

  return React.createElement(ArrivalContext.Provider, { value: store }, children);
}

export function useArrival() {
  const store = React.useContext(ArrivalContext);
  const [arrived] = React.useState(() => hasArrived(store));
  return arrived;
}

export function useChanged<T>(value: T) {
  const [initial] = React.useState(value);
  const [changed, setChanged] = React.useState(false);
  if (!changed && value !== initial) setChanged(true);
  return changed;
}

export function useAutoHeight<T extends HTMLElement = HTMLDivElement>() {
  const ref = React.useRef<T>(null);
  const [height, setHeight] = React.useState<number>();

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, height === undefined ? undefined : { height }] as const;
}

export function Roll({ value }: { value: number | string }) {
  const changed = useChanged(value);
  return React.createElement(
    'span',
    { key: value, className: changed ? ROLL_IN : undefined },
    value,
  );
}

export function StreamText({ text }: { text: string }) {
  const words = text.split(' ');
  const [initial] = React.useState(words.length);

  return React.createElement(
    React.Fragment,
    null,
    words.map((word, index) =>
      React.createElement(
        'span',
        { key: index, className: index >= initial ? TOKEN_IN : undefined },
        index > 0 ? ` ${word}` : word,
      ),
    ),
  );
}
