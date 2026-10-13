import { describe, expect, it } from 'vitest';
import { getSidebarPreviews, type PreviewSourceDoc } from './sidebar-previews';

const doc = (overrides: Partial<PreviewSourceDoc>): PreviewSourceDoc => ({
  locale: 'en',
  published: true,
  raw: '',
  slugAsParams: 'elements/ui/button',
  title: 'Button',
  description: 'Clickable.',
  ...overrides,
});

describe('getSidebarPreviews', () => {
  it('uses the first ComponentPreview of each page, keyed by nav href', () => {
    const previews = getSidebarPreviews(
      [
        doc({
          raw: [
            'Intro',
            '<ComponentPreview component="button" demo="variants" />',
            '<ComponentPreview component="button" demo="sizes" />',
          ].join('\n'),
        }),
      ],
      'en',
    );

    expect(previews).toEqual({
      '/docs/elements/ui/button': {
        title: 'Button',
        description: 'Clickable.',
        component: 'button',
        demo: 'variants',
      },
    });
  });

  it('skips other locales, unpublished pages and pages without a full preview tag', () => {
    const previews = getSidebarPreviews(
      [
        doc({ locale: 'es', raw: '<ComponentPreview component="button" demo="default" />' }),
        doc({ published: false, raw: '<ComponentPreview component="button" demo="default" />' }),
        doc({ slugAsParams: 'concepts/cli', raw: 'No demos here.' }),
        doc({ slugAsParams: 'elements/ui/card', raw: '<ComponentPreview component="card" />' }),
      ],
      'en',
    );

    expect(previews).toEqual({});
  });
});
