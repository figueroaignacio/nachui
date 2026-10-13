import { afterEach, describe, expect, it } from 'vitest';
import { focusFirst, isTopmostLayer, lockPageScroll, trapFocus } from './overlay';

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

describe('isTopmostLayer', () => {
  it('treats the last modal in the document as the top layer', () => {
    const lower = modal('lower');
    const upper = modal('upper');

    expect(isTopmostLayer(upper, document.body)).toBe(true);
    expect(isTopmostLayer(lower, document.body)).toBe(false);
  });

  it('prefers the modal that owns the event target', () => {
    const lower = modal('lower');
    modal('upper');
    const target = lower.querySelector('button');

    expect(isTopmostLayer(lower, target)).toBe(true);
  });

  it('returns false without a node', () => {
    expect(isTopmostLayer(null, document.body)).toBe(false);
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
