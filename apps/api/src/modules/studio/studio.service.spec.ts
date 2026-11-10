jest.mock('@repo/db', () => ({}), { virtual: true });
jest.mock('@repo/ai', () => ({ createStudioAgent: jest.fn(() => ({ tools: {} })) }));
jest.mock('ai', () => ({ pipeAgentUIStreamToResponse: jest.fn(() => Promise.resolve()) }));

import { HttpException } from '@nestjs/common';
import { createStudioAgent } from '@repo/ai';
import type { StudioWorkspace } from '@repo/ai/studio-core';
import type { StudioProject, StudioUser } from '@repo/db';
import { pipeAgentUIStreamToResponse } from 'ai';
import type { Response } from 'express';
import type { StudioConfig } from '../../config/env';
import type { AuthService } from '../auth/auth.service';
import type { GithubClient } from '../github/github.client';
import type { RagService } from '../rag/rag.service';
import type { RegistryRepository } from '../registry/registry.repository';
import type { CatalogService } from './catalog.service';
import type { StudioRepository } from './studio.repository';
import { StudioService } from './studio.service';

const config: StudioConfig = {
  apiUrl: 'http://localhost:3001',
  studioUrl: 'http://localhost:3002',
  githubClientId: 'id',
  githubClientSecret: 'secret',
  secret: 's'.repeat(32),
  dailyLimit: 3,
};

const user = { id: 'u1', login: 'octo' } as StudioUser;
const PROJECT_ID = '7f2c1c0e-1b2a-4c3d-9e8f-001122334455';
const SCREEN = `import { Card } from '../components/card';\nexport default function Billing() { return <Card />; }`;

function project(overrides: Partial<StudioProject> = {}): StudioProject {
  return {
    id: PROJECT_ID,
    userId: 'u1',
    name: 'Billing page',
    currentVersion: 2,
    lastError: null,
    pullRequestUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function setup(
  options: { generations?: number; project?: StudioProject; token?: string | null } = {},
) {
  const repository = {
    findProject: jest.fn(() => Promise.resolve(options.project ?? project())),
    findVersion: jest.fn((_id: string, number: number) =>
      Promise.resolve({
        number,
        files: { 'screens/billing.tsx': SCREEN },
      }),
    ),
    getThread: jest.fn(() =>
      Promise.resolve([{ id: 'm0', role: 'user', parts: [{ type: 'text', text: 'Hi' }] }]),
    ),
    usage: jest.fn(() => Promise.resolve({ generations: options.generations ?? 0, tokens: 0 })),
    addGeneration: jest.fn(() => Promise.resolve(1)),
    addTokens: jest.fn(() => Promise.resolve(undefined)),
    saveThread: jest.fn(() => Promise.resolve(undefined)),
    addVersion: jest.fn(() => Promise.resolve(3)),
    touchProject: jest.fn(() => Promise.resolve(undefined)),
    setPullRequest: jest.fn(() => Promise.resolve(undefined)),
  };
  const catalog = {
    listImportPaths: jest.fn(() => Promise.resolve(['components/card', 'lib/cn'])),
    source: jest.fn((dir: string, name: string) =>
      Promise.resolve(
        dir === 'components' && name === 'card'
          ? `import { cn } from '../lib/cn';\nexport const Card = () => null;`
          : dir === 'lib' && name === 'cn'
            ? 'export const cn = () => "";'
            : null,
      ),
    ),
    closure: jest.fn(() => Promise.resolve(['lib/cn', 'ui/card'])),
  };
  const auth = {
    repoToken: jest.fn(() => (options.token === undefined ? 'gho_token' : options.token)),
  };
  const github = {
    fileExists: jest.fn((_token: string, _repo: string, path: string) =>
      Promise.resolve(path === 'src/lib/cn.ts'),
    ),
    openPullRequest: jest.fn(() =>
      Promise.resolve({
        url: 'https://github.com/acme/app/pull/7',
        branch: 'studio/billing-page-v2',
      }),
    ),
    listRepos: jest.fn(() => Promise.resolve([])),
  };
  const service = new StudioService(
    config,
    repository as unknown as StudioRepository,
    catalog as unknown as CatalogService,
    auth as unknown as AuthService,
    github as unknown as GithubClient,
    { search: jest.fn() } as unknown as RagService,
    { resolve: jest.fn() } as unknown as RegistryRepository,
  );
  return { service, repository, catalog, github, auth };
}

const message = { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Add a usage chart' }] };
const res = {} as Response;
const signal = new AbortController().signal;

describe('StudioService.streamChat', () => {
  beforeEach(() => jest.clearAllMocks());

  it('stops at the daily limit before calling the model', async () => {
    const { service, repository } = setup({ generations: 3 });
    const error = await service
      .streamChat(user, PROJECT_ID, { message }, res, signal)
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(429);
    expect(createStudioAgent).not.toHaveBeenCalled();
    expect(repository.addGeneration).not.toHaveBeenCalled();
  });

  it('rejects anything but a single user message', async () => {
    const { service } = setup();
    await expect(
      service.streamChat(
        user,
        PROJECT_ID,
        { message: { ...message, role: 'assistant' } },
        res,
        signal,
      ),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      service.streamChat(user, 'not-a-uuid', { message }, res, signal),
    ).rejects.toMatchObject({
      status: 404,
    });
  });

  it('runs the agent on the saved thread and saves a version when files changed', async () => {
    const { service, repository } = setup();
    await service.streamChat(user, PROJECT_ID, { message, model: 'pro' }, res, signal);

    const agentOptions = jest.mocked(createStudioAgent).mock.calls[0]?.[0] as unknown as {
      workspace: StudioWorkspace;
      model: string;
    };
    expect(agentOptions.model).toBe('pro');
    expect(agentOptions.workspace.list()).toEqual(['screens/billing.tsx']);

    const pipe = jest.mocked(pipeAgentUIStreamToResponse).mock.calls[0]?.[0] as unknown as {
      uiMessages: Array<{ id: string }>;
      onEnd: (event: { messages: unknown[]; responseMessage: { id: string } }) => Promise<void>;
    };
    expect(pipe.uiMessages.map((m) => m.id)).toEqual(['m0', 'm1']);
    expect(repository.addGeneration).toHaveBeenCalledWith('u1', expect.any(String));

    agentOptions.workspace.write('screens/billing.tsx', `${SCREEN}\n`);
    await pipe.onEnd({ messages: ['saved'], responseMessage: { id: 'a1' } });

    expect(repository.saveThread).toHaveBeenCalledWith(PROJECT_ID, ['saved']);
    expect(repository.addVersion).toHaveBeenCalledWith({
      projectId: PROJECT_ID,
      files: { 'screens/billing.tsx': `${SCREEN}\n` },
      summary: 'Add a usage chart',
      messageId: 'a1',
      lastError: null,
    });
  });

  it('only touches the project when the turn wrote nothing', async () => {
    const { service, repository } = setup();
    await service.streamChat(user, PROJECT_ID, { message }, res, signal);
    const pipe = jest.mocked(pipeAgentUIStreamToResponse).mock.calls[0]?.[0] as unknown as {
      onEnd: (event: { messages: unknown[]; responseMessage: { id: string } }) => Promise<void>;
    };
    await pipe.onEnd({ messages: [], responseMessage: { id: 'a1' } });
    expect(repository.addVersion).not.toHaveBeenCalled();
    expect(repository.touchProject).toHaveBeenCalledWith(PROJECT_ID);
  });
});

describe('StudioService exports', () => {
  beforeEach(() => jest.clearAllMocks());

  it('plans the CLI command and every file with its install path', async () => {
    const { service, catalog } = setup();
    await expect(service.exportPlan(user, PROJECT_ID, 'src')).resolves.toEqual({
      command: 'npx nachui add ui/card',
      items: ['lib/cn', 'ui/card'],
      files: [
        { path: 'src/screens/billing.tsx', kind: 'screen' },
        { path: 'src/lib/cn.ts', kind: 'nachui', slug: 'lib/cn' },
        { path: 'src/components/card.tsx', kind: 'nachui', slug: 'ui/card' },
      ],
    });
    expect(catalog.closure).toHaveBeenCalledWith(['ui/card']);
    await expect(service.exportPlan(user, PROJECT_ID, '../x')).rejects.toMatchObject({
      status: 400,
    });
  });

  it('opens a pull request and keeps NachUI files the repo already has', async () => {
    const { service, github, repository } = setup();
    const result = await service.openPullRequest(user, PROJECT_ID, {
      repo: 'acme/app',
      base: 'main',
      baseDir: 'src',
    });

    expect(result).toEqual({
      url: 'https://github.com/acme/app/pull/7',
      branch: 'studio/billing-page-v2',
      skipped: ['src/lib/cn.ts'],
    });
    const call = (github.openPullRequest as jest.Mock).mock.calls[0] as [
      string,
      { files: Array<{ path: string }>; branch: string },
    ];
    expect(call[0]).toBe('gho_token');
    expect(call[1].branch).toBe('studio/billing-page-v2');
    expect(call[1].files.map((file) => file.path)).toEqual([
      'src/screens/billing.tsx',
      'src/components/card.tsx',
    ]);
    expect(repository.setPullRequest).toHaveBeenCalledWith(PROJECT_ID, result.url);
  });

  it('refuses broken versions, missing repo access and bad repo names', async () => {
    const broken = setup({ project: project({ lastError: 'screens/billing.tsx:1 nope' }) });
    await expect(
      broken.service.openPullRequest(user, PROJECT_ID, { repo: 'acme/app', base: 'main' }),
    ).rejects.toMatchObject({ status: 409 });

    const noToken = setup({ token: null });
    await expect(
      noToken.service.openPullRequest(user, PROJECT_ID, { repo: 'acme/app', base: 'main' }),
    ).rejects.toMatchObject({ status: 409 });

    const { service } = setup();
    await expect(
      service.openPullRequest(user, PROJECT_ID, { repo: 'acme/app/../x', base: 'main' }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('restores by saving the old files as a new version', async () => {
    const { service, repository } = setup();
    await expect(service.restore(user, PROJECT_ID, 1)).resolves.toEqual({ version: 3 });
    expect(repository.addVersion).toHaveBeenCalledWith(
      expect.objectContaining({ summary: 'Restored v1', messageId: null, lastError: null }),
    );
  });
});
