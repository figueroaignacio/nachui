import type { UIMessage } from 'ai';

export type StudioUser = {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string | null;
  hasRepoAccess: boolean;
};

export type Usage = {
  used: number;
  limit: number;
  tokens: number;
  resetsAt: string;
};

export type ProjectSummary = {
  id: string;
  name: string;
  version: number;
  lastError: string | null;
  pullRequestUrl: string | null;
  updatedAt: string;
};

export type VersionSummary = {
  number: number;
  summary: string | null;
  messageId: string | null;
  createdAt: string;
};

export type ProjectFiles = Record<string, string>;

export type Project = ProjectSummary & {
  files: ProjectFiles;
  versions: VersionSummary[];
  messages: UIMessage[];
};

export type ExportFile = { path: string; kind: 'screen' | 'nachui'; slug?: string };

export type ExportPlan = {
  command: string | null;
  items: string[];
  files: ExportFile[];
};

export type Repo = {
  fullName: string;
  defaultBranch: string;
  private: boolean;
};

export type StudioModel = 'flash' | 'pro';
