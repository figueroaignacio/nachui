import * as React from 'react';
import { getNavigationIndex } from './collection';
import { type Direction, resolveDirection, useDirection } from './direction';
import { assignRef } from './overlay';

type RovingOrientation = 'horizontal' | 'vertical';

interface RovingFocusScope {
  tabStop: string | null;
  register: (id: string, element: React.RefObject<HTMLElement | null>) => () => void;
  onItemFocus: (id: string) => void;
  onItemKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

const RovingFocusContext = React.createContext<RovingFocusScope | null>(null);

function useComposedRef<T extends HTMLElement>(
  first: React.Ref<T> | undefined,
  second: React.Ref<T> | undefined,
) {
  return React.useCallback(
    (node: T | null) => {
      assignRef(first, node);
      assignRef(second, node);
    },
    [first, second],
  );
}

const NON_TEXT_INPUTS = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);
const TEXT_ENTRY_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End']);

function isDisabled(element: HTMLElement) {
  return element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true';
}

function isTextEntry(element: HTMLElement) {
  if (element.isContentEditable || element.tagName === 'TEXTAREA') return true;
  return element instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(element.type);
}

interface RovingFocusOptions {
  orientation: RovingOrientation;
  dir?: Direction;
  loop?: boolean;
  isPreferred?: (element: HTMLElement) => boolean;
  resetOnLeave?: boolean;
}

function useRovingFocusGroup<T extends HTMLElement>({
  orientation,
  dir,
  loop = true,
  isPreferred,
  resetOnLeave = false,
}: RovingFocusOptions) {
  const direction = useDirection(dir);
  const rootRef = React.useRef<T | null>(null);
  const itemsRef = React.useRef(new Map<string, React.RefObject<HTMLElement | null>>());
  const lastFocusedRef = React.useRef<string | null>(null);
  const isPreferredRef = React.useRef(isPreferred);
  const [tabStop, setTabStop] = React.useState<string | null>(null);

  const getItems = React.useCallback(() => {
    const items: { id: string; element: HTMLElement }[] = [];
    for (const [id, ref] of itemsRef.current) {
      if (ref.current && !isDisabled(ref.current)) items.push({ id, element: ref.current });
    }
    return items.sort((a, b) =>
      a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
  }, []);

  const sync = React.useCallback(() => {
    const items = getItems();
    const prefer = isPreferredRef.current;
    const next =
      items.find((item) => item.id === lastFocusedRef.current) ??
      (prefer ? items.find((item) => prefer(item.element)) : undefined) ??
      items[0];
    setTabStop(next?.id ?? null);
  }, [getItems]);

  React.useLayoutEffect(() => {
    isPreferredRef.current = isPreferred;
    sync();
  });

  const register = React.useCallback(
    (id: string, element: React.RefObject<HTMLElement | null>) => {
      itemsRef.current.set(id, element);
      sync();
      return () => {
        itemsRef.current.delete(id);
        sync();
      };
    },
    [sync],
  );

  const onItemFocus = React.useCallback((id: string) => {
    lastFocusedRef.current = id;
    setTabStop(id);
  }, []);

  const setRoot = React.useCallback((node: T | null) => {
    rootRef.current = node;
  }, []);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const elements = getItems().map((item) => item.element);
      const target = event.currentTarget;
      const index = elements.indexOf(target);
      if (index === -1) return;
      if (isTextEntry(target) && TEXT_ENTRY_KEYS.has(event.key)) return;
      const rtl = resolveDirection(rootRef.current, direction) === 'rtl';
      const next = getNavigationIndex(event.key, index, elements.length, {
        orientation,
        rtl,
        loop,
      });
      if (next === null) return;
      event.preventDefault();
      elements[next]?.focus();
    },
    [getItems, direction, orientation, loop],
  );

  const onBlur = React.useCallback(
    (event: React.FocusEvent) => {
      if (!resetOnLeave) return;
      const root = rootRef.current;
      const nextTarget = event.relatedTarget;
      if (root && nextTarget instanceof Node && root.contains(nextTarget)) return;
      lastFocusedRef.current = null;
      sync();
    },
    [resetOnLeave, sync],
  );

  const scope = React.useMemo<RovingFocusScope>(
    () => ({ tabStop, register, onItemFocus, onItemKeyDown }),
    [tabStop, register, onItemFocus, onItemKeyDown],
  );

  return { setRoot, scope, onBlur };
}

interface RovingFocusItemOptions<T extends HTMLElement> {
  disabled?: boolean;
  onFocus?: React.FocusEventHandler<T>;
  onKeyDown?: React.KeyboardEventHandler<T>;
}

function useRovingFocusItem<T extends HTMLElement>({
  disabled,
  onFocus,
  onKeyDown,
}: RovingFocusItemOptions<T>) {
  const scope = React.use(RovingFocusContext);
  const id = React.useId();
  const elementRef = React.useRef<T | null>(null);
  const register = scope?.register;
  const onItemFocus = scope?.onItemFocus;
  const onItemKeyDown = scope?.onItemKeyDown;

  React.useLayoutEffect(() => register?.(id, elementRef), [register, id, disabled]);

  const setNode = React.useCallback((node: T | null) => {
    elementRef.current = node;
  }, []);

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<T>) => {
      onFocus?.(event);
      onItemFocus?.(id);
    },
    [onFocus, onItemFocus, id],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<T>) => {
      onKeyDown?.(event);
      onItemKeyDown?.(event);
    },
    [onKeyDown, onItemKeyDown],
  );

  const tabIndex = !scope ? undefined : scope.tabStop === null || scope.tabStop === id ? 0 : -1;

  return { setNode, tabIndex, onFocus: handleFocus, onKeyDown: handleKeyDown };
}

export { RovingFocusContext, useComposedRef, useRovingFocusGroup, useRovingFocusItem };
export type { RovingFocusScope, RovingOrientation };
