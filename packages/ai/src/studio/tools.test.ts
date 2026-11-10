import { describe, expect, it, vi } from 'vitest';
import { createStudioTools, type StudioAgentDeps } from './tools.js';
import { StudioWorkspace } from './workspace.js';

const deps: StudioAgentDeps = {
  searchKnowledgeBase: vi.fn(async () => []),
  getComponent: vi.fn(async () => ({ status: 'not-found' as const })),
  listCatalog: vi.fn(async () => ['components/button', 'components/card']),
  getCatalogSource: vi.fn(async (dir, name) =>
    dir === 'components' && name === 'button' ? 'export const Button = () => null;' : null,
  ),
};

const options = { toolCallId: 'call-1', messages: [] } as never;

describe('Studio tools', () => {
  it('writes into the workspace and checks it', async () => {
    const workspace = new StudioWorkspace();
    const tools = createStudioTools(deps, workspace);

    const written = await tools.writeFile.execute!(
      {
        path: 'screens/hello.tsx',
        content: `import { Button } from '../components/button';\nexport default function Hello() { return <Button>Hi</Button>; }`,
      },
      options,
    );
    expect(written).toMatchObject({ ok: true, path: 'screens/hello.tsx', created: true });
    expect(workspace.changed).toBe(true);

    const checks = await tools.runChecks.execute!({}, options);
    expect(checks).toEqual({ ok: true, checked: 1, diagnostics: [] });
  });

  it('explains a refused path and a missing file', async () => {
    const workspace = new StudioWorkspace();
    const tools = createStudioTools(deps, workspace);

    const refused = await tools.writeFile.execute!({ path: 'lib/cn.ts', content: 'x' }, options);
    expect(refused).toMatchObject({ ok: false });

    const missing = await tools.readFile.execute!({ path: 'screens/nope.tsx' }, options);
    expect(missing).toMatchObject({
      ok: false,
      message: expect.stringContaining('does not exist'),
    });
  });

  it('lists the catalog through the injected data access', async () => {
    const tools = createStudioTools(deps, new StudioWorkspace());
    expect(await tools.listComponents.execute!({}, options)).toEqual({
      components: ['components/button', 'components/card'],
    });
  });
});
