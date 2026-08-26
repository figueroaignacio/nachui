'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface DialogBehaviorOptions {
  open: boolean;
  onClose: () => void;
  ref: RefObject<HTMLElement | null>;
  trap?: boolean;
}

export function useDialogBehavior({ open, onClose, ref, trap = true }: DialogBehaviorOptions) {
  useEffect(() => {
    if (!open) return;

    const panel = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const frame = requestAnimationFrame(() => {
      const target =
        panel?.querySelector<HTMLElement>('[data-autofocus]') ??
        panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
        panel;
      target?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const panel = ref.current;
        const owner =
          event.target instanceof Element ? event.target.closest('[role="dialog"]') : null;
        if (owner && panel && owner !== panel && !panel.contains(owner)) return;

        onClose();
        return;
      }

      if (event.key !== 'Tab' || !trap) return;

      const focusable = Array.from(
        ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      if (ref.current?.contains(document.activeElement)) previouslyFocused?.focus();
    };
  }, [open, onClose, ref, trap]);
}
