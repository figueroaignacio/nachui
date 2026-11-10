import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { InlineCitation } from './inline-citation';

const SOURCES = [{ url: 'https://docs.stripe.com/currencies', title: 'Rounding and currency' }];

describe('InlineCitation in a real browser', () => {
  it('opens the sources on hover', async () => {
    const screen = await render(
      <p className="p-8">
        The fix rounds once, after tax,{' '}
        <InlineCitation sources={SOURCES}>as the provider recommends</InlineCitation>.
      </p>,
    );
    await userEvent.hover(screen.getByRole('button', { name: /docs.stripe.com/ }));
    await expect.element(screen.getByRole('link', { name: /Rounding and currency/ })).toBeVisible();
  });

  it('opens on keyboard focus, so the sources are reachable without a mouse', async () => {
    const screen = await render(
      <div className="p-8">
        <button type="button">Before</button>
        <InlineCitation sources={SOURCES} />
      </div>,
    );
    screen.getByRole('button', { name: 'Before' }).element().focus();
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: /docs.stripe.com/ })).toHaveFocus();
    await expect.element(screen.getByRole('link', { name: /Rounding and currency/ })).toBeVisible();
  });
});
