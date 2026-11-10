import { tool, type Tool } from 'ai';
import { z } from 'zod';
import {
  createGetComponentCodeTool,
  type GetComponent,
  type GetComponentCodeTool,
} from '../tools/get-component-code-tool.js';
import {
  createSearchKnowledgeBaseTool,
  type SearchKnowledgeBase,
  type SearchKnowledgeBaseTool,
} from '../tools/search-knowledge-base-tool.js';
import { checkProject, type CatalogSourceLookup, type StudioCheckResult } from './check.js';
import { PROJECT_LIMITS } from './paths.js';
import type { StudioWorkspace } from './workspace.js';

/** Data access the Studio tools run against. The API provides it. */
export type StudioAgentDeps = {
  searchKnowledgeBase: SearchKnowledgeBase;
  getComponent: GetComponent;
  listCatalog: () => Promise<string[]>;
  getCatalogSource: CatalogSourceLookup;
};

export const PLAN_STEP_STATUSES = ['pending', 'active', 'complete', 'skipped'] as const;

const planInput = z.object({
  title: z.string().min(1).max(120).describe('What this turn will do, in a few words'),
  steps: z
    .array(
      z.object({
        title: z.string().min(1).max(120),
        status: z.enum(PLAN_STEP_STATUSES),
      }),
    )
    .min(1)
    .max(8),
});

const pathInput = z
  .string()
  .min(1)
  .max(PROJECT_LIMITS.maxPathLength)
  .describe('Project path, like screens/billing-page.tsx');

const writeInput = z.object({
  path: pathInput,
  content: z.string().max(PROJECT_LIMITS.maxFileChars).describe('The whole file'),
});

const writeOutput = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), path: z.string(), lines: z.number(), created: z.boolean() }),
  z.object({ ok: z.literal(false), message: z.string() }),
]);

const readOutput = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), path: z.string(), content: z.string() }),
  z.object({ ok: z.literal(false), message: z.string() }),
]);

const checkOutput = z.object({
  ok: z.boolean(),
  checked: z.number(),
  diagnostics: z.array(
    z.object({
      file: z.string(),
      line: z.number().optional(),
      rule: z.enum(['syntax', 'import', 'export', 'entry']),
      message: z.string(),
    }),
  ),
});

export type SetPlanInput = z.infer<typeof planInput>;
export type WriteFileInput = z.infer<typeof writeInput>;
export type WriteFileOutput = z.infer<typeof writeOutput>;
export type ReadFileOutput = z.infer<typeof readOutput>;
export type RunChecksOutput = StudioCheckResult;

export type StudioTools = {
  setPlan: Tool<SetPlanInput, { ok: true }>;
  listComponents: Tool<Record<string, never>, { components: string[] }>;
  getComponentCode: GetComponentCodeTool;
  searchKnowledgeBase: SearchKnowledgeBaseTool;
  readFile: Tool<{ path: string }, ReadFileOutput>;
  writeFile: Tool<WriteFileInput, WriteFileOutput>;
  deleteFile: Tool<{ path: string }, { ok: boolean }>;
  runChecks: Tool<Record<string, never>, RunChecksOutput>;
};

export function createStudioTools(deps: StudioAgentDeps, workspace: StudioWorkspace): StudioTools {
  return {
    setPlan: tool({
      description:
        'Show the reader the steps of this turn. Call it first, then again whenever a step changes status.',
      inputSchema: planInput,
      outputSchema: z.object({ ok: z.literal(true) }),
      execute: async () => ({ ok: true as const }),
    }),
    listComponents: tool({
      description:
        'List every NachUI file you can import, as paths like components/card or ai/tool. Call it before choosing components.',
      inputSchema: z.object({}),
      outputSchema: z.object({ components: z.array(z.string()) }),
      execute: async () => ({ components: await deps.listCatalog() }),
    }),
    getComponentCode: createGetComponentCodeTool(deps.getComponent),
    searchKnowledgeBase: createSearchKnowledgeBaseTool(deps.searchKnowledgeBase),
    readFile: tool({
      description: 'Read a file of this project.',
      inputSchema: z.object({ path: pathInput }),
      outputSchema: readOutput,
      execute: async ({ path }) => {
        const content = workspace.read(path);
        return content === undefined
          ? {
              ok: false as const,
              message: `${path} does not exist. Files: ${workspace.list().join(', ') || 'none'}.`,
            }
          : { ok: true as const, path, content };
      },
    }),
    writeFile: tool({
      description:
        'Create or replace a project file with its whole content. Screens go in screens/<name>.tsx, their parts in screens/<name>/<part>.tsx.',
      inputSchema: writeInput,
      outputSchema: writeOutput,
      execute: async ({ path, content }) => workspace.write(path, content),
    }),
    deleteFile: tool({
      description: 'Delete a project file that is no longer used.',
      inputSchema: z.object({ path: pathInput }),
      outputSchema: z.object({ ok: z.boolean() }),
      execute: async ({ path }) => ({ ok: workspace.remove(path) }),
    }),
    runChecks: tool({
      description:
        'Check syntax, imports and exports of every project file. Call it after writing and fix every diagnostic before you finish.',
      inputSchema: z.object({}),
      outputSchema: checkOutput,
      execute: async () => checkProject(workspace.snapshot(), deps.getCatalogSource),
    }),
  };
}
