import { describe, expect, it } from 'vitest';
import { calculateRelevanceScore } from './calculate-relevance-score';
import { searchItems } from './search-items';

const item = (title: string, href: string) => ({ title, href, category: 'UI' });

describe('calculateRelevanceScore', () => {
  const button = item('Button', '/docs/elements/ui/button');

  it('ranks title matches above href matches at every level', () => {
    expect(calculateRelevanceScore(button, 'button')).toBe(1000);
    expect(calculateRelevanceScore(button, '/docs/elements/ui/button')).toBe(900);
    expect(calculateRelevanceScore(button, 'butt')).toBe(800);
    expect(calculateRelevanceScore(button, '/docs/el')).toBe(700);
    expect(calculateRelevanceScore(button, 'utto')).toBe(600);
    expect(calculateRelevanceScore(button, 'elements')).toBe(500);
  });

  it('scores zero when nothing matches', () => {
    expect(calculateRelevanceScore(button, 'tooltip')).toBe(0);
  });
});

describe('searchItems', () => {
  it('returns matches best first and drops the rest', () => {
    const items = [
      item('Button Group', '/docs/elements/ui/button-group'),
      item('Tooltip', '/docs/elements/ui/tooltip'),
      item('Button', '/docs/elements/ui/button'),
    ];

    expect(searchItems(items, 'Button').map((result) => result.title)).toEqual([
      'Button',
      'Button Group',
    ]);
  });

  it('returns nothing for a blank query', () => {
    expect(searchItems([item('Button', '/docs/button')], '   ')).toEqual([]);
  });
});
