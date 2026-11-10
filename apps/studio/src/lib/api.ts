import { API_BASE } from './config';
import type { ExportPlan, Project, ProjectSummary, Repo, StudioUser, Usage } from './types';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
    readonly data?: Record<string, unknown>,
  ) {
    super(message);
  }
}

function readMessage(data: unknown, fallback: string): string {
  if (typeof data !== 'object' || data === null) return fallback;
  const message = (data as { message?: unknown }).message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.join(' ');
  return fallback;
}

async function request<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: init.method ?? 'GET',
    credentials: 'include',
    headers: init.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const record = (typeof data === 'object' && data !== null ? data : {}) as Record<
      string,
      unknown
    >;
    throw new ApiError(
      response.status,
      readMessage(data, response.statusText),
      typeof record.error === 'string' ? record.error : undefined,
      record,
    );
  }
  return data as T;
}

export const studioApi = {
  me: () => request<StudioUser>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  deleteAccount: () => request<void>('/auth/account', { method: 'DELETE' }),
  disconnectRepos: () => request<void>('/auth/github/repo', { method: 'DELETE' }),
  usage: () => request<Usage>('/studio/usage'),
  projects: () => request<ProjectSummary[]>('/studio/projects'),
  createProject: (prompt: string) =>
    request<{ id: string; name: string }>('/studio/projects', { method: 'POST', body: { prompt } }),
  project: (id: string) => request<Project>(`/studio/projects/${encodeURIComponent(id)}`),
  rename: (id: string, name: string) =>
    request<{ id: string; name: string }>(`/studio/projects/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: { name },
    }),
  remove: (id: string) =>
    request<void>(`/studio/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  restore: (id: string, version: number) =>
    request<{ version: number }>(`/studio/projects/${encodeURIComponent(id)}/restore`, {
      method: 'POST',
      body: { version },
    }),
  exportPlan: (id: string, baseDir: string) =>
    request<ExportPlan>(
      `/studio/projects/${encodeURIComponent(id)}/export?baseDir=${encodeURIComponent(baseDir)}`,
    ),
  repos: () => request<Repo[]>('/studio/github/repos'),
  pullRequest: (id: string, body: { repo: string; base: string; baseDir: string }) =>
    request<{ url: string; branch: string; skipped: string[] }>(
      `/studio/projects/${encodeURIComponent(id)}/pull-request`,
      { method: 'POST', body },
    ),
};

export function signInUrl(next = '/'): string {
  return `${API_BASE}/auth/github?next=${encodeURIComponent(next)}`;
}

export function connectReposUrl(next = '/'): string {
  return `${API_BASE}/auth/github/repo?next=${encodeURIComponent(next)}`;
}

export function chatUrl(projectId: string): string {
  return `${API_BASE}/studio/projects/${encodeURIComponent(projectId)}/chat`;
}
