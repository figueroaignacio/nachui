import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Toggle } from './toggle';

function BoldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7z" />
    </svg>
  );
}

describe('Toggle in a real browser', () => {
  it('presses with the pointer and focuses with Tab', async () => {
    const screen = await render(
      <div>
        <button type="button">Before</button>
        <Toggle aria-label="Bold">
          <BoldIcon />
        </Toggle>
      </div>,
    );
    const toggle = screen.getByRole('button', { name: 'Bold' });
    await userEvent.click(toggle);
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(toggle);
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');

    (screen.getByRole('button', { name: 'Before' }).element() as HTMLElement).focus();
    await userEvent.tab();
    await expect.element(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('is square with only an icon, in every size', async () => {
    const screen = await render(
      <div className="flex gap-2">
        <Toggle aria-label="Small" size="sm">
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Default">
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Large" size="lg" variant="outline">
          <BoldIcon />
        </Toggle>
      </div>,
    );
    const expected = { Small: 32, Default: 36, Large: 40 };
    for (const [name, size] of Object.entries(expected)) {
      const rect = screen.getByRole('button', { name }).element().getBoundingClientRect();
      expect(rect.height).toBe(size);
      expect(rect.width).toBe(size);
    }
  });

  it('shows the muted fill only while on', async () => {
    const screen = await render(
      <div>
        <Toggle aria-label="On" defaultPressed>
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Off">
          <BoldIcon />
        </Toggle>
      </div>,
    );
    const on = getComputedStyle(screen.getByRole('button', { name: 'On' }).element());
    const off = getComputedStyle(screen.getByRole('button', { name: 'Off' }).element());
    expect(on.backgroundColor).not.toBe(off.backgroundColor);
    expect(off.backgroundColor).toMatch(
      /^(transparent|rgba\(0, 0, 0, 0\)|oklab\(0 0 0 \/ 0\)|color\(srgb 0 0 0 \/ 0\))$/,
    );
  });
});
