'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_PREFIX = 'nachui:tab:';
const CHANGE_EVENT = 'nachui:tab-state';

interface TabStateOptions<T extends string> {
  values: readonly T[];
  defaultValue: T;
  /** Remembers the choice in localStorage under this key, shared by every tab group that uses it. */
  storageKey?: string;
  /** Mirrors the choice into this query param, so a shared link opens on the same tab. */
  param?: string;
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener('popstate', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, value);
  } catch {
    return;
  }
}

/**
 * Tab selection that survives navigation. The query param wins when it holds a
 * known value, then the stored choice, then `defaultValue`. The server and the
 * first client render always use `defaultValue`, so hydration stays stable.
 */
export function useTabState<T extends string>({
  values,
  defaultValue,
  storageKey,
  param,
}: TabStateOptions<T>) {
  const isValue = useCallback(
    (value: string | null): value is T => values.includes(value as T),
    [values],
  );

  const getSnapshot = useCallback(() => {
    if (param) {
      const fromUrl = new URLSearchParams(window.location.search).get(param);
      if (isValue(fromUrl)) return fromUrl;
    }
    if (storageKey) {
      const stored = readStorage(storageKey);
      if (isValue(stored)) return stored;
    }
    return defaultValue;
  }, [param, storageKey, isValue, defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);

  const setValue = useCallback(
    (next: string) => {
      if (!isValue(next)) return;
      if (storageKey) writeStorage(storageKey, next);
      if (param) {
        const url = new URL(window.location.href);
        if (next === defaultValue) url.searchParams.delete(param);
        else url.searchParams.set(param, next);
        window.history.replaceState(window.history.state, '', url);
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [isValue, storageKey, param, defaultValue],
  );

  return [value, setValue] as const;
}
