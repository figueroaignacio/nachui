import { describe, expect, it } from 'vitest';
import { extractToc } from './extract-toc';

describe('extractToc', () => {
  it('nests h3 entries under the preceding h2', () => {
    const toc = extractToc(['## Usage', '### Basic', '### With icon', '## API'].join('\n'));

    expect(toc).toEqual([
      {
        title: 'Usage',
        url: '#usage',
        items: [
          { title: 'Basic', url: '#basic' },
          { title: 'With icon', url: '#with-icon' },
        ],
      },
      { title: 'API', url: '#api' },
    ]);
  });

  it('ignores headings inside code fences and h1 or h4', () => {
    const toc = extractToc(
      ['# Title', '```md', '## Not a heading', '```', '## Real', '#### Too deep'].join('\n'),
    );

    expect(toc).toEqual([{ title: 'Real', url: '#real' }]);
  });

  it('strips inline markdown and gives repeated headings unique slugs', () => {
    const toc = extractToc(
      ['## The `size` prop', '## [Link](https://x.dev) **bold**', '## Props', '## Props'].join(
        '\n',
      ),
    );

    expect(toc.map((entry) => entry.title)).toEqual([
      'The size prop',
      'Link bold',
      'Props',
      'Props',
    ]);
    expect(toc.map((entry) => entry.url)).toEqual([
      '#the-size-prop',
      '#link-bold',
      '#props',
      '#props-1',
    ]);
  });

  it('keeps an h3 with no h2 above it at the top level', () => {
    expect(extractToc('### Orphan')).toEqual([{ title: 'Orphan', url: '#orphan' }]);
  });
});
