import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { focusFirst, getFocusable, lockPageScroll, trapFocus, useLayer } from './overlay';

function modal(id: string) {
  const node = document.createElement('div');
  node.id = id;
  node.setAttribute('aria-modal', 'true');
  node.innerHTML = `<button id="${id}-first">First</button><button id="${id}-last">Last</button>`;
  document.body.appendChild(node);
  return node;
}

function tab(shiftKey = false) {
  return new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true });
}

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  document.documentElement.style.paddingRight = '';
  delete document.documentElement.dataset.scrollLocked;
  delete document.documentElement.dataset.scrollLockedOverflow;
});

describe('lockPageScroll', () => {
  it('hides body overflow and restores the previous value on release', () => {
    document.body.style.overflow = 'scroll';
    const release = lockPageScroll();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBe('1');

    release();

    expect(document.body.style.overflow).toBe('scroll');
    expect(document.documentElement.dataset.scrollLocked).toBeUndefined();
  });

  it('keeps the page locked until every stacked modal has released', () => {
    const releaseDialog = lockPageScroll();
    const releaseSheet = lockPageScroll();
    expect(document.documentElement.dataset.scrollLocked).toBe('2');

    releaseDialog();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBe('1');

    releaseSheet();
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.dataset.scrollLocked).toBeUndefined();
  });

  it('restores padding the page already had', () => {
    document.documentElement.style.paddingRight = '12px';
    const release = lockPageScroll();
    release();
    expect(document.documentElement.style.paddingRight).toBe('12px');
  });

  it('ignores a second release from the same lock', () => {
    const releaseOuter = lockPageScroll();
    const releaseInner = lockPageScroll();

    releaseInner();
    releaseInner();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBe('1');

    releaseOuter();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('useLayer', () => {
  it('treats the most recently opened layer as the top one', () => {
    const lower = renderHook(({ open }) => useLayer(open, true), { initialProps: { open: true } });
    const upper = renderHook(({ open }) => useLayer(open), { initialProps: { open: true } });

    expect(upper.result.current.isTopmost()).toBe(true);
    expect(lower.result.current.isTopmost()).toBe(false);
    expect(lower.result.current.isTopmostModal()).toBe(true);
    expect(upper.result.current.isTopmostModal()).toBe(false);

    act(() => upper.rerender({ open: false }));

    expect(lower.result.current.isTopmost()).toBe(true);
    lower.unmount();
    upper.unmount();
  });

  it('is never topmost while closed', () => {
    const closed = renderHook(() => useLayer(false, true));
    expect(closed.result.current.isTopmost()).toBe(false);
    expect(closed.result.current.isTopmostModal()).toBe(false);
    closed.unmount();
  });
});

describe('focus helpers', () => {
  it('focuses the first focusable element, or the container itself', () => {
    const layer = modal('layer');
    focusFirst(layer);
    expect(document.activeElement?.id).toBe('layer-first');

    const empty = document.createElement('div');
    empty.tabIndex = -1;
    document.body.appendChild(empty);
    focusFirst(empty);
    expect(document.activeElement).toBe(empty);
  });

  it('wraps Tab from the last element to the first and back', () => {
    const layer = modal('layer');
    const first = layer.querySelector<HTMLElement>('#layer-first');
    const last = layer.querySelector<HTMLElement>('#layer-last');

    last?.focus();
    const forward = tab();
    trapFocus(forward, layer);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    const backward = tab(true);
    trapFocus(backward, layer);
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('pulls focus back in when it sits on the container or outside it', () => {
    const layer = modal('layer');
    layer.tabIndex = -1;
    layer.focus();

    const backward = tab(true);
    trapFocus(backward, layer);
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('layer-last');

    document.body.focus();
    const forward = tab();
    trapFocus(forward, layer);
    expect(document.activeElement?.id).toBe('layer-first');
  });

  it('keeps focus on an empty layer instead of letting Tab leave it', () => {
    const empty = document.createElement('div');
    empty.tabIndex = -1;
    document.body.appendChild(empty);
    empty.focus();

    const forward = tab();
    trapFocus(forward, empty);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(empty);
  });

  it('skips hidden inputs and content inside hidden or inert regions', () => {
    const layer = document.createElement('div');
    layer.innerHTML = `
      <input type="hidden" />
      <div hidden><button>Hidden</button></div>
      <div inert><button>Inert</button></div>
      <button id="visible">Visible</button>`;
    document.body.appendChild(layer);

    expect(getFocusable(layer).map((node) => node.id)).toEqual(['visible']);
    focusFirst(layer);
    expect(document.activeElement?.id).toBe('visible');
  });

  it('leaves Tab alone in the middle of the layer and for other keys', () => {
    const layer = modal('layer');
    layer.querySelector<HTMLElement>('#layer-first')?.focus();

    const forward = tab();
    trapFocus(forward, layer);
    expect(forward.defaultPrevented).toBe(false);

    const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    trapFocus(enter, layer);
    expect(enter.defaultPrevented).toBe(false);
  });
});
