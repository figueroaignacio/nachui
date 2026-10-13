const where = jest.fn();

jest.mock(
  '@repo/db',
  () => ({
    components: { slug: 'slug' },
    db: { select: () => ({ from: () => ({ where }) }) },
    eq: (column: string, value: string) => ({ op: 'eq', column, value }),
    like: (column: string, value: string) => ({ op: 'like', column, value }),
  }),
  { virtual: true },
);

import { RegistryRepository } from './registry.repository';

const row = (slug: string) => ({ slug, registryDependencies: ['lib/cn'] });

describe('RegistryRepository.resolve', () => {
  const repository = new RegistryRepository();

  beforeEach(() => where.mockReset());

  it.each(['%', 'but_ton', '../button', 'ui/button/extra'])(
    'rejects %p without querying',
    async (input) => {
      await expect(repository.resolve(input)).resolves.toEqual({ status: 'invalid' });
      expect(where).not.toHaveBeenCalled();
    },
  );

  it('looks up a qualified slug exactly and returns its registryDependencies', async () => {
    where.mockResolvedValueOnce([row('ui/button')]);

    await expect(repository.resolve('UI/Button')).resolves.toEqual({
      status: 'found',
      component: row('ui/button'),
    });
    expect(where).toHaveBeenCalledWith({ op: 'eq', column: 'slug', value: 'ui/button' });
  });

  it('matches a bare name against the qualified suffix', async () => {
    where.mockResolvedValueOnce([row('ui/button')]);

    await expect(repository.resolve('button')).resolves.toMatchObject({ status: 'found' });
    expect(where).toHaveBeenCalledWith({ op: 'like', column: 'slug', value: '%/button' });
  });

  it('reports ambiguity with sorted candidates', async () => {
    where.mockResolvedValueOnce([row('ui/tool'), row('ai/tool')]);

    await expect(repository.resolve('tool')).resolves.toEqual({
      status: 'ambiguous',
      candidates: ['ai/tool', 'ui/tool'],
    });
  });
});
