import { DatabaseHealth } from './database-health';

const execute = jest.fn<Promise<unknown>, [unknown]>();

jest.mock('@repo/db', () => ({
  db: { execute: (query: unknown) => execute(query) },
  sql: (strings: TemplateStringsArray) => strings.join(''),
}));

describe('DatabaseHealth', () => {
  const health = new DatabaseHealth();

  afterEach(() => execute.mockReset());

  it('reports up when select 1 answers', async () => {
    execute.mockResolvedValue([{ '?column?': 1 }]);

    const result = await health.check();

    expect(result.status).toBe('up');
    expect(execute).toHaveBeenCalledWith('select 1');
  });

  it('reports down when the query fails', async () => {
    execute.mockRejectedValue(new Error('connect ECONNREFUSED'));

    await expect(health.check()).resolves.toMatchObject({
      status: 'down',
      error: 'connect ECONNREFUSED',
    });
  });

  it('reports down when the query hangs past the timeout', async () => {
    execute.mockReturnValue(new Promise(() => undefined));

    await expect(health.check(20)).resolves.toMatchObject({
      status: 'down',
      error: 'timed out after 20ms',
    });
  });
});
