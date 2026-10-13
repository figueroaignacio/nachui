import { describe, expect, it, vi } from 'vitest';
import {
  createGetComponentCodeTool,
  type ComponentLookup,
  type GetComponentCodeOutput,
} from './get-component-code-tool.js';

async function run(lookup: ComponentLookup | Error, componentName = 'button') {
  const getComponent = vi.fn(async () => {
    if (lookup instanceof Error) throw lookup;
    return lookup;
  });
  const tool = createGetComponentCodeTool(getComponent);
  const options = { toolCallId: 'call-1', messages: [] } as unknown as Parameters<
    NonNullable<typeof tool.execute>
  >[1];
  const output = (await tool.execute!({ componentName }, options)) as GetComponentCodeOutput;
  return { output, getComponent };
}

describe('getComponentCode tool', () => {
  it('returns the source when the registry finds the component', async () => {
    const { output, getComponent } = await run({
      status: 'found',
      component: { slug: 'ui/button', code: 'export function Button() {}', dependencies: ['clsx'] },
    });

    expect(getComponent).toHaveBeenCalledWith('button');
    expect(output).toEqual({
      found: true,
      componentName: 'ui/button',
      code: 'export function Button() {}',
      dependencies: ['clsx'],
    });
  });

  it('asks for a qualified slug when the name is ambiguous', async () => {
    const { output } = await run({ status: 'ambiguous', candidates: ['ai/card', 'ui/card'] });

    expect(output.found).toBe(false);
    expect(output.found === false && output.message).toContain('ai/card, ui/card');
  });

  it('explains an invalid name instead of reporting it as missing', async () => {
    const { output } = await run({ status: 'invalid' }, 'ui/%');

    expect(output.found).toBe(false);
    expect(output.found === false && output.message).toContain('not a valid component name');
  });

  it('reports a missing component', async () => {
    const { output } = await run({ status: 'not-found' }, 'nope');

    expect(output).toEqual({ found: false, message: 'Component "nope" not found' });
  });

  it('turns a registry failure into a tool result rather than throwing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { output } = await run(new Error('db down'));

    expect(output).toEqual({ found: false, message: 'Failed to fetch component.' });
    spy.mockRestore();
  });
});
