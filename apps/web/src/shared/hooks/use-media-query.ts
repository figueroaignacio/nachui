'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Tracks a media query. Returns false on the server and during hydration, so
 * the server and the first client render agree.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
