import * as React from 'react';

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function focusFirst(container: HTMLElement) {
  (container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? container).focus();
}

export function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  if (event.key !== 'Tab') return;

  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function isTopmostLayer(node: HTMLElement | null, target: EventTarget | null) {
  if (!node) return false;
  const owner = target instanceof Element ? target.closest('[aria-modal="true"]') : null;
  if (owner) return owner === node;
  const layers = document.querySelectorAll('[aria-modal="true"]');
  return layers[layers.length - 1] === node;
}

export function lockPageScroll() {
  const root = document.documentElement;
  const depth = Number(root.dataset.scrollLocked ?? '0');

  if (depth === 0) {
    const gutter = window.innerWidth - root.clientWidth;
    root.dataset.scrollLockedOverflow = document.body.style.overflow;
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
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
    root.style.paddingRight = '';
    delete root.dataset.scrollLocked;
    delete root.dataset.scrollLockedOverflow;
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
