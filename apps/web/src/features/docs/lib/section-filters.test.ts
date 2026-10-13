import type { DocSection } from '@/lib/definitions';
import { describe, expect, it } from 'vitest';
import { ALL_SECTIONS, buildSectionFilters, sectionOf } from './section-filters';

const sections: DocSection[] = [
  {
    id: 'start',
    title: 'Sections',
    items: [
      { title: 'Getting Started', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
    ],
  },
  {
    id: 'ui',
    title: 'UI',
    items: [{ title: 'Button', href: '/docs/elements/ui/button' }],
  },
];

describe('sectionOf', () => {
  it('returns the id of the section that lists the path', () => {
    expect(sectionOf(sections, '/docs/installation')).toBe('start');
    expect(sectionOf(sections, '/docs/elements/ui/button')).toBe('ui');
  });

  it('matches nested paths by prefix, but never through /docs itself', () => {
    expect(sectionOf(sections, '/docs/elements/ui/button/examples')).toBe('ui');
    expect(sectionOf(sections, '/docs/unknown')).toBe(ALL_SECTIONS);
  });
});

describe('buildSectionFilters', () => {
  it('starts with the all filter and keys the rest by section id', () => {
    const filters = buildSectionFilters(sections, 'All');

    expect(filters.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: ALL_SECTIONS, label: 'All' },
      { id: 'start', label: 'Getting Started' },
      { id: 'ui', label: 'UI' },
    ]);
    expect(filters.every((filter) => typeof filter.Icon === 'function')).toBe(true);
  });
});
