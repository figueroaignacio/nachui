import * as React from 'react';

export type Direction = 'ltr' | 'rtl';

const DirectionContext = React.createContext<Direction | undefined>(undefined);

interface DirectionProviderProps {
  dir: Direction;
  children?: React.ReactNode;
}

export function DirectionProvider({ dir, children }: DirectionProviderProps) {
  return React.createElement(DirectionContext, { value: dir }, children);
}

export function useDirection(explicit?: Direction) {
  const inherited = React.use(DirectionContext);
  return explicit ?? inherited;
}

export function resolveDirection(element: Element | null, explicit?: Direction): Direction {
  if (explicit) return explicit;
  if (!element || typeof getComputedStyle === 'undefined') return 'ltr';
  return getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}
