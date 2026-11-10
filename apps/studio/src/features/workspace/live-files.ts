import type { UIMessage } from 'ai';
import type { ProjectFiles } from '@/lib/types';

type ToolLike = {
  type: string;
  state?: string;
  input?: unknown;
  output?: unknown;
};

function asTool(part: unknown): ToolLike | null {
  return typeof part === 'object' && part !== null && typeof (part as ToolLike).type === 'string'
    ? (part as ToolLike)
    : null;
}

/**
 * The saved files with whatever the running turn already wrote on top, so the
 * preview follows the agent file by file instead of waiting for the end.
 */
export function liveFiles(saved: ProjectFiles, message: UIMessage | undefined): ProjectFiles {
  if (!message || message.role !== 'assistant') return saved;
  let files = saved;
  for (const raw of message.parts) {
    const part = asTool(raw);
    if (!part) continue;
    const ready = part.state === 'input-available' || part.state === 'output-available';
    const failed =
      typeof part.output === 'object' &&
      part.output !== null &&
      (part.output as { ok?: unknown }).ok === false;
    if (!ready || failed) continue;
    const input = (part.input ?? {}) as { path?: unknown; content?: unknown };
    if (typeof input.path !== 'string') continue;
    const path = input.path.replace(/^\.\//, '');
    if (part.type === 'tool-writeFile' && typeof input.content === 'string') {
      files = { ...files, [path]: input.content };
    }
    if (part.type === 'tool-deleteFile' && path in files) {
      files = Object.fromEntries(Object.entries(files).filter(([key]) => key !== path));
    }
  }
  return files;
}
