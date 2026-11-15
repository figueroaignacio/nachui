import type { ChatSourcePage, ChatStep } from '@/lib/definitions';
import type { UIMessage } from 'ai';
import { getToolName, isToolUIPart } from 'ai';

const TOOLS = new Set<ChatStep['tool']>(['searchKnowledgeBase', 'getComponentCode']);

const PAGES_PER_STEP = 3;
const MAX_SOURCES = 5;

function isKnownTool(name: string): name is ChatStep['tool'] {
  return TOOLS.has(name as ChatStep['tool']);
}

function pagesFrom(output: unknown): ChatSourcePage[] {
  if (!output || typeof output !== 'object') return [];
  const { found, results } = output as { found?: unknown; results?: unknown };
  if (found !== true || !Array.isArray(results)) return [];

  const pages: ChatSourcePage[] = [];
  const seen = new Set<string>();
  for (const result of results) {
    if (!result || typeof result !== 'object') continue;
    const { title, slug } = result as { title?: unknown; slug?: unknown };
    if (typeof title !== 'string' || typeof slug !== 'string' || seen.has(slug)) continue;
    seen.add(slug);
    pages.push({ title, slug });
    if (pages.length === PAGES_PER_STEP) break;
  }
  return pages;
}

function detailFrom(input: unknown): string | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const { query, componentName } = input as { query?: unknown; componentName?: unknown };
  if (typeof query === 'string') return query;
  if (typeof componentName === 'string') return componentName;
  return undefined;
}

/** The tool calls of an assistant message, in the order the agent made them. */
export function toChatSteps(parts: UIMessage['parts']): ChatStep[] {
  const steps: ChatStep[] = [];

  for (const part of parts) {
    if (!isToolUIPart(part)) continue;
    const tool = getToolName(part);
    if (!isKnownTool(tool)) continue;

    const status: ChatStep['status'] =
      part.state === 'output-available'
        ? 'complete'
        : part.state === 'output-error'
          ? 'error'
          : 'active';

    steps.push({
      id: part.toolCallId,
      tool,
      status,
      detail: detailFrom(part.input),
      pages:
        tool === 'searchKnowledgeBase' && part.state === 'output-available'
          ? pagesFrom(part.output)
          : undefined,
    });
  }

  return steps;
}

/** Every page the searches of a turn found, once each. */
export function collectSources(steps: ChatStep[]): ChatSourcePage[] {
  const sources: ChatSourcePage[] = [];
  const seen = new Set<string>();

  for (const step of steps) {
    for (const page of step.pages ?? []) {
      if (seen.has(page.slug)) continue;
      seen.add(page.slug);
      sources.push(page);
      if (sources.length === MAX_SOURCES) return sources;
    }
  }

  return sources;
}
