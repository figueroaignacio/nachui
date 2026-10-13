import { tool, type Tool, type UIToolInvocation } from 'ai';
import { z } from 'zod';

export type ComponentSource = {
  slug: string;
  code: string;
  dependencies?: string[] | null;
};

/** What a registry lookup found. Ambiguity is a result, not an error. */
export type ComponentLookup =
  | { status: 'found'; component: ComponentSource }
  | { status: 'not-found' }
  | { status: 'invalid' }
  | { status: 'ambiguous'; candidates: string[] };

/** Data access the tool needs. The API wires it to its registry repository. */
export type GetComponent = (name: string) => Promise<ComponentLookup>;

const inputSchema = z.object({
  componentName: z
    .string()
    .min(1)
    .max(100)
    .describe('Component name (`button`) or qualified slug (`ui/button`)'),
});

const outputSchema = z.discriminatedUnion('found', [
  z.object({
    found: z.literal(true),
    componentName: z.string(),
    code: z.string(),
    dependencies: z.array(z.string()).optional(),
  }),
  z.object({ found: z.literal(false), message: z.string() }),
]);

export type GetComponentCodeInput = z.infer<typeof inputSchema>;
export type GetComponentCodeOutput = z.infer<typeof outputSchema>;
export type GetComponentCodeTool = Tool<GetComponentCodeInput, GetComponentCodeOutput>;

export function createGetComponentCodeTool(getComponent: GetComponent): GetComponentCodeTool {
  return tool({
    description:
      'Get the real source code of a NachUI component from the registry. Accepts a bare name (`button`) or a qualified slug (`ui/button`).',
    inputSchema,
    outputSchema,
    execute: async ({ componentName }): Promise<GetComponentCodeOutput> => {
      try {
        const result = await getComponent(componentName);

        if (result.status === 'ambiguous') {
          return {
            found: false,
            message: `"${componentName}" exists in more than one family (${result.candidates.join(', ')}). Ask again with the qualified slug.`,
          };
        }

        if (result.status === 'invalid') {
          return {
            found: false,
            message: `"${componentName}" is not a valid component name. Use a name like \`button\` or a slug like \`ui/button\`.`,
          };
        }

        if (result.status === 'not-found') {
          return { found: false, message: `Component "${componentName}" not found` };
        }

        return {
          found: true,
          componentName: result.component.slug,
          code: result.component.code,
          dependencies: result.component.dependencies ?? undefined,
        };
      } catch (error) {
        console.error('[getComponentCode] error:', error);
        return { found: false, message: 'Failed to fetch component.' };
      }
    },
  });
}

export type ComponentCodeToolInvocation = UIToolInvocation<GetComponentCodeTool>;
