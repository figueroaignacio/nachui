import { normalizeSlug } from './slug';

describe('normalizeSlug', () => {
  it.each([
    ['button', 'button'],
    ['UI/Button', 'ui/button'],
    ['lib/use-controllable-state', 'lib/use-controllable-state'],
  ])('accepts %s', (input, expected) => {
    expect(normalizeSlug(input)).toBe(expected);
  });

  it.each(['%', 'but_ton', '%/button', 'ui/button/extra', '../etc', 'ui/', '', 'a b'])(
    'rejects %p',
    (input) => {
      expect(normalizeSlug(input)).toBeNull();
    },
  );
});
