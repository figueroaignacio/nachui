import * as React from 'react';

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  'iframe',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function isReachable(element: HTMLElement) {
  if (element.closest('[inert], [hidden], [aria-hidden="true"]')) return false;
  if (typeof element.checkVisibility === 'function') {
    return element.checkVisibility({ visibilityProperty: true });
  }
  return true;
}

export function getFocusable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    isReachable,
  );
}

export function focusFirst(container: HTMLElement) {
  const autofocus = container.querySelector<HTMLElement>('[data-autofocus], [autofocus]');
  const target = autofocus && isReachable(autofocus) ? autofocus : getFocusable(container)[0];
  (target ?? container).focus();
}

export function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  if (event.key !== 'Tab') return;

  const focusable = getFocusable(container);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) {
    event.preventDefault();
    container.focus();
    return;
  }

  const active = document.activeElement;
  const inside = active instanceof HTMLElement && focusable.includes(active);

  if (!inside) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  } else if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

type Layer = { modal: boolean };

const layers: Layer[] = [];

export function useLayer(active: boolean, modal = false) {
  const entryRef = React.useRef<Layer | null>(null);

  React.useEffect(() => {
    if (!active) return;
    const entry: Layer = { modal };
    layers.push(entry);
    entryRef.current = entry;
    return () => {
      const index = layers.indexOf(entry);
      if (index !== -1) layers.splice(index, 1);
      if (entryRef.current === entry) entryRef.current = null;
    };
  }, [active, modal]);

  return React.useMemo(
    () => ({
      isTopmost: () => entryRef.current !== null && layers[layers.length - 1] === entryRef.current,
      isTopmostModal: () => {
        const entry = entryRef.current;
        if (!entry) return false;
        for (let index = layers.length - 1; index >= 0; index -= 1) {
          if (layers[index]?.modal) return layers[index] === entry;
        }
        return false;
      },
    }),
    [],
  );
}

export function lockPageScroll() {
  const root = document.documentElement;
  const depth = Number(root.dataset.scrollLocked ?? '0');

  if (depth === 0) {
    const gutter = window.innerWidth - root.clientWidth;
    root.dataset.scrollLockedOverflow = document.body.style.overflow;
    root.dataset.scrollLockedPadding = root.style.paddingRight;
    root.dataset.scrollLockedOverscroll = root.style.overscrollBehavior;
    if (gutter > 0) {
      const padding = Number.parseFloat(getComputedStyle(root).paddingRight) || 0;
      root.style.paddingRight = `${padding + gutter}px`;
    }
    root.style.setProperty('--scroll-lock-gutter', `${gutter}px`);
    root.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
  }
  root.dataset.scrollLocked = String(depth + 1);

  let released = false;

  return () => {
    if (released) return;
    released = true;

    const remaining = Number(root.dataset.scrollLocked ?? '1') - 1;
    if (remaining > 0) {
      root.dataset.scrollLocked = String(remaining);
      return;
    }

    document.body.style.overflow = root.dataset.scrollLockedOverflow ?? '';
    root.style.paddingRight = root.dataset.scrollLockedPadding ?? '';
    root.style.overscrollBehavior = root.dataset.scrollLockedOverscroll ?? '';
    root.style.removeProperty('--scroll-lock-gutter');
    delete root.dataset.scrollLocked;
    delete root.dataset.scrollLockedOverflow;
    delete root.dataset.scrollLockedPadding;
    delete root.dataset.scrollLockedOverscroll;
  };
}

export function assignRef<T>(ref: React.Ref<T> | undefined, node: T) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

const subscribeToNothing = () => () => {};

export function useIsClient() {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
