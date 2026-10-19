import * as React from 'react';

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolledValue;

  const currentRef = React.useRef(current);
  const renderedRef = React.useRef(current);
  const isControlledRef = React.useRef(isControlled);
  const onChangeRef = React.useRef(onChange);

  React.useLayoutEffect(() => {
    currentRef.current = current;
    renderedRef.current = current;
    isControlledRef.current = isControlled;
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback((next: React.SetStateAction<T>) => {
    const previous = currentRef.current;
    const isUpdater = typeof next === 'function';
    const resolved = isUpdater ? (next as (previous: T) => T)(previous) : next;
    const settled = isControlledRef.current && !isUpdater ? renderedRef.current : previous;
    if (Object.is(resolved, settled)) return;

    currentRef.current = resolved;
    if (isControlledRef.current) {
      queueMicrotask(() => {
        if (isControlledRef.current) currentRef.current = renderedRef.current;
      });
    } else {
      setUncontrolledValue(resolved);
    }
    onChangeRef.current?.(resolved);
  }, []);

  return [current, setValue] as const;
}
