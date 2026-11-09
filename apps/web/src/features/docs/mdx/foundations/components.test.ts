import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { foundationsComponents } from './index';

const entries = Object.entries(foundationsComponents) as [
  string,
  ComponentType<{ locale?: 'en' | 'es' }>,
][];

describe('foundations MDX components', () => {
  for (const [name, Component] of entries) {
    for (const locale of ['en', 'es'] as const) {
      it(`${name} renders the same markup twice in ${locale}`, () => {
        const first = renderToStaticMarkup(createElement(Component, { locale }));
        const second = renderToStaticMarkup(createElement(Component, { locale }));
        expect(first.length).toBeGreaterThan(0);
        expect(first).toBe(second);
      });
    }
  }

  it('renders the token values from the theme files', () => {
    const html = renderToStaticMarkup(createElement(foundationsComponents.ColorPalette));
    expect(html).toContain('oklch(99.1% 0.003 85)');
    expect(html).toContain('oklch(14.5% 0 0)');
    expect(html).toContain('--muted-foreground');
    expect(html).toContain('text-muted-foreground');
  });

  it('shows a grade for every contrast pair', () => {
    const html = renderToStaticMarkup(createElement(foundationsComponents.ContrastTable));
    expect(html).toContain('19.29:1');
    expect(html).not.toContain('>fail<');
  });
});
