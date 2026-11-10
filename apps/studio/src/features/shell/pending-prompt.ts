import type { StudioModel } from '@/lib/types';

const key = (projectId: string) => `studio:pending:${projectId}`;

export type PendingPrompt = { text: string; model: StudioModel };

/** The first prompt travels from the home page to the new project without touching the URL. */
export function savePendingPrompt(projectId: string, prompt: PendingPrompt): void {
  try {
    sessionStorage.setItem(key(projectId), JSON.stringify(prompt));
  } catch {
    return;
  }
}

export function clearPendingPrompt(projectId: string): void {
  try {
    sessionStorage.removeItem(key(projectId));
  } catch {
    return;
  }
}

export function readPendingPrompt(projectId: string): PendingPrompt | null {
  try {
    const raw = sessionStorage.getItem(key(projectId));
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<PendingPrompt>;
    return typeof value.text === 'string' && value.text.trim()
      ? { text: value.text, model: value.model === 'pro' ? 'pro' : 'flash' }
      : null;
  } catch {
    return null;
  }
}
