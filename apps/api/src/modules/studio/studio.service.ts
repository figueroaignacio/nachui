import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createStudioAgent, type StudioAgentDeps, type StudioAgentUIMessage } from '@repo/ai';
import {
  catalogSlug,
  checkProject,
  parseStudioUserMessage,
  projectCatalogImports,
  projectNameFromPrompt,
  StudioWorkspace,
  type StudioDiagnostic,
} from '@repo/ai/studio-core';
import type { StudioFiles, StudioProject, StudioUser } from '@repo/db';
import { pipeAgentUIStreamToResponse } from 'ai';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { STUDIO_CONFIG, type MaybeStudioConfig } from '../auth/studio-config';
import {
  chatErrorMessage,
  classifyChatError,
  formatChatError,
  isAbortError,
} from '../chat/chat-error';
import { GithubClient, GithubError, isBranchName, isRepoName } from '../github/github.client';
import { RagService } from '../rag/rag.service';
import { RegistryRepository } from '../registry/registry.repository';
import { CatalogService, importPathOf, installPath } from './catalog.service';
import { StudioRepository } from './studio.repository';
import { branchSlug, isUuid, nextUtcMidnight, normalizeBaseDir, utcDay } from './usage';

export type ExportFile = { path: string; kind: 'screen' | 'nachui'; slug?: string };

export type ExportPlan = {
  command: string | null;
  items: string[];
  files: ExportFile[];
};

function describeDiagnostic(diagnostic: StudioDiagnostic | undefined): string | null {
  if (!diagnostic) return null;
  return `${diagnostic.file}${diagnostic.line ? `:${diagnostic.line}` : ''} ${diagnostic.message}`;
}

function promptText(message: { parts: Array<{ text: string }> }): string {
  return message.parts
    .map((part) => part.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

@Injectable()
export class StudioService {
  private readonly logger = new Logger(StudioService.name);
  private readonly deps: StudioAgentDeps;

  constructor(
    @Inject(STUDIO_CONFIG) private readonly config: MaybeStudioConfig,
    private readonly repository: StudioRepository,
    private readonly catalog: CatalogService,
    private readonly auth: AuthService,
    private readonly github: GithubClient,
    rag: RagService,
    registry: RegistryRepository,
  ) {
    this.deps = {
      searchKnowledgeBase: ({ query, locale, topK }) => rag.search(query, locale, topK),
      getComponent: (name) => registry.resolve(name),
      listCatalog: () => catalog.listImportPaths(),
      getCatalogSource: (dir, name) => catalog.source(dir, name),
    };
  }

  private get dailyLimit(): number {
    return this.config?.dailyLimit ?? 0;
  }

  async usage(user: StudioUser) {
    const { generations, tokens } = await this.repository.usage(user.id, utcDay());
    return {
      used: generations,
      limit: this.dailyLimit,
      tokens,
      resetsAt: nextUtcMidnight().toISOString(),
    };
  }

  listProjects(user: StudioUser) {
    return this.repository.listProjects(user.id);
  }

  async createProject(user: StudioUser, prompt: unknown) {
    const name = projectNameFromPrompt(typeof prompt === 'string' ? prompt.slice(0, 500) : '');
    const project = await this.repository.createProject(user.id, name);
    return { id: project.id, name: project.name };
  }

  private async requireProject(user: StudioUser, id: string): Promise<StudioProject> {
    const project = isUuid(id) ? await this.repository.findProject(user.id, id) : null;
    if (!project) throw new NotFoundException('That project does not exist.');
    return project;
  }

  private async currentFiles(project: StudioProject): Promise<StudioFiles> {
    if (project.currentVersion === 0) return {};
    const version = await this.repository.findVersion(project.id, project.currentVersion);
    return version?.files ?? {};
  }

  async project(user: StudioUser, id: string) {
    const project = await this.requireProject(user, id);
    const [files, versions, messages] = await Promise.all([
      this.currentFiles(project),
      this.repository.listVersions(project.id),
      this.repository.getThread(project.id),
    ]);
    return {
      id: project.id,
      name: project.name,
      version: project.currentVersion,
      lastError: project.lastError,
      pullRequestUrl: project.pullRequestUrl,
      updatedAt: project.updatedAt,
      files,
      versions,
      messages,
    };
  }

  async rename(user: StudioUser, id: string, name: unknown) {
    const project = await this.requireProject(user, id);
    const value = typeof name === 'string' ? name.replace(/\s+/g, ' ').trim() : '';
    if (value.length === 0 || value.length > 80) {
      throw new BadRequestException('Names need 1 to 80 characters.');
    }
    await this.repository.renameProject(project.id, value);
    return { id: project.id, name: value };
  }

  async remove(user: StudioUser, id: string) {
    const project = await this.requireProject(user, id);
    await this.repository.deleteProject(project.id);
  }

  /** Restoring never deletes: it saves the old files as the newest version. */
  async restore(user: StudioUser, id: string, number: unknown) {
    const project = await this.requireProject(user, id);
    const value = typeof number === 'number' ? number : Number(number);
    const version = Number.isInteger(value)
      ? await this.repository.findVersion(project.id, value)
      : null;
    if (!version) throw new NotFoundException('That version does not exist.');

    const check = await checkProject(version.files, this.deps.getCatalogSource);
    const created = await this.repository.addVersion({
      projectId: project.id,
      files: version.files,
      summary: `Restored v${version.number}`,
      messageId: null,
      lastError: describeDiagnostic(check.diagnostics[0]),
    });
    return { version: created };
  }

  async streamChat(
    user: StudioUser,
    id: string,
    body: unknown,
    res: Response,
    abortSignal: AbortSignal,
  ): Promise<void> {
    const project = await this.requireProject(user, id);
    const input = (typeof body === 'object' && body !== null ? body : {}) as Record<
      string,
      unknown
    >;
    const parsed = parseStudioUserMessage(input.message);
    if (!parsed.success) throw new BadRequestException(parsed.error);

    const day = utcDay();
    const { generations } = await this.repository.usage(user.id, day);
    if (generations >= this.dailyLimit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'limit',
          message: `You used all ${this.dailyLimit} generations for today.`,
          resetsAt: nextUtcMidnight().toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const [files, thread] = await Promise.all([
      this.currentFiles(project),
      this.repository.getThread(project.id),
    ]);
    const workspace = new StudioWorkspace(files);
    const agent = createStudioAgent({
      deps: this.deps,
      workspace,
      model: input.model === 'pro' ? 'pro' : 'flash',
    });
    const uiMessages = [...thread, parsed.message] as StudioAgentUIMessage[];
    let tokens = 0;

    await this.repository.addGeneration(user.id, day);

    await pipeAgentUIStreamToResponse({
      response: res,
      agent,
      uiMessages,
      originalMessages: uiMessages,
      generateMessageId: randomUUID,
      abortSignal,
      onStepEnd: ({ usage }) => {
        tokens += usage?.totalTokens ?? 0;
      },
      onEnd: async ({ messages, responseMessage }) => {
        try {
          await this.repository.saveThread(project.id, messages);
          if (workspace.changed) {
            const snapshot = workspace.snapshot();
            const check = await checkProject(snapshot, this.deps.getCatalogSource);
            await this.repository.addVersion({
              projectId: project.id,
              files: snapshot,
              summary: promptText(parsed.message).slice(0, 140),
              messageId: responseMessage.id,
              lastError: describeDiagnostic(check.diagnostics[0]),
            });
          } else {
            await this.repository.touchProject(project.id);
          }
          await this.repository.addTokens(user.id, day, tokens);
        } catch (error) {
          this.logger.error(`Could not save the turn of ${project.id}`, error as Error);
        }
      },
      onError: (error: unknown) => {
        if (isAbortError(error)) return formatChatError('aborted', chatErrorMessage('aborted'));
        const code = classifyChatError(error);
        this.logger.error(`Studio stream error [${code}]`, error as Error);
        return formatChatError(code, chatErrorMessage(code));
      },
    });
  }

  async exportPlan(user: StudioUser, id: string, baseDirInput: unknown): Promise<ExportPlan> {
    const baseDir = normalizeBaseDir(baseDirInput);
    if (baseDir === null) throw new BadRequestException('Use a folder like src or app/src.');
    const project = await this.requireProject(user, id);
    const files = await this.currentFiles(project);
    return this.planFor(files, baseDir);
  }

  private async planFor(files: StudioFiles, baseDir: string): Promise<ExportPlan> {
    const direct = projectCatalogImports(files).map(({ dir, name }) => catalogSlug(dir, name));
    const items = await this.catalog.closure(direct);
    const join = (path: string) => [baseDir, path].filter(Boolean).join('/');
    return {
      command: direct.length > 0 ? `npx nachui add ${direct.join(' ')}` : null,
      items,
      files: [
        ...Object.keys(files).map((path) => ({ path: join(path), kind: 'screen' as const })),
        ...items.map((slug) => ({
          path: installPath(slug, baseDir),
          kind: 'nachui' as const,
          slug,
        })),
      ],
    };
  }

  async repos(user: StudioUser) {
    const token = this.auth.repoToken(user);
    if (!token)
      throw new ConflictException({
        error: 'repo_access',
        message: 'Connect GitHub to pick a repository.',
      });
    try {
      return await this.github.listRepos(token);
    } catch (error) {
      throw this.githubFailure(error);
    }
  }

  async openPullRequest(user: StudioUser, id: string, body: unknown) {
    const input = (typeof body === 'object' && body !== null ? body : {}) as Record<
      string,
      unknown
    >;
    const repo = typeof input.repo === 'string' ? input.repo.trim() : '';
    const base = typeof input.base === 'string' ? input.base.trim() : '';
    const baseDir = normalizeBaseDir(input.baseDir);
    if (!isRepoName(repo)) throw new BadRequestException('Pick a repository like owner/name.');
    if (!isBranchName(base)) throw new BadRequestException('Pick the branch to merge into.');
    if (baseDir === null) throw new BadRequestException('Use a folder like src or app/src.');

    const project = await this.requireProject(user, id);
    if (project.lastError) {
      throw new ConflictException({
        error: 'broken',
        message: 'Fix the errors in this version before exporting it.',
      });
    }
    const token = this.auth.repoToken(user);
    if (!token)
      throw new ConflictException({
        error: 'repo_access',
        message: 'Connect GitHub to open a pull request.',
      });

    const files = await this.currentFiles(project);
    if (Object.keys(files).length === 0)
      throw new ConflictException('There is nothing to export yet.');
    const plan = await this.planFor(files, baseDir);

    try {
      const tree: Array<{ path: string; content: string }> = [];
      const skipped: string[] = [];
      const join = (path: string) => [baseDir, path].filter(Boolean).join('/');
      for (const [path, content] of Object.entries(files)) tree.push({ path: join(path), content });
      for (const file of plan.files) {
        if (file.kind !== 'nachui' || !file.slug) continue;
        if (await this.github.fileExists(token, repo, file.path, base)) {
          skipped.push(file.path);
          continue;
        }
        const importPath = importPathOf(file.slug);
        const [dir, name] = importPath ? importPath.split('/') : [];
        const code = dir && name ? await this.catalog.source(dir as never, name) : null;
        if (code) tree.push({ path: file.path, content: code });
      }

      const title = `Add ${project.name} from NachUI Studio`;
      const lines = [
        `Generated in NachUI Studio, version ${project.currentVersion}.`,
        '',
        ...tree.map((file) => `- \`${file.path}\``),
        ...(skipped.length > 0
          ? [
              '',
              'Already in the repo, left as they are:',
              ...skipped.map((path) => `- \`${path}\``),
            ]
          : []),
      ];
      const result = await this.github.openPullRequest(token, {
        repo,
        base,
        branch: `studio/${branchSlug(project.name)}-v${project.currentVersion}`,
        title,
        body: lines.join('\n'),
        files: tree,
      });
      await this.repository.setPullRequest(project.id, result.url);
      return { url: result.url, branch: result.branch, skipped };
    } catch (error) {
      throw this.githubFailure(error);
    }
  }

  private githubFailure(error: unknown): HttpException {
    if (error instanceof GithubError) {
      if (error.status === 401 || error.status === 403) {
        return new ConflictException({
          error: 'repo_access',
          message: 'GitHub refused the request. Connect it again.',
        });
      }
      if (error.status === 404) {
        return new BadRequestException('That repository or branch was not found.');
      }
      return new HttpException(`GitHub: ${error.message}`, HttpStatus.BAD_GATEWAY);
    }
    if (error instanceof HttpException) return error;
    this.logger.error('GitHub export failed', error as Error);
    return new HttpException('The export failed. Try again.', HttpStatus.BAD_GATEWAY);
  }
}
