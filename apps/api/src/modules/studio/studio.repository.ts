import { Injectable } from '@nestjs/common';
import {
  and,
  db,
  desc,
  eq,
  sql,
  studioProjects,
  studioThreads,
  studioUsage,
  studioVersions,
  type StudioFiles,
  type StudioProject,
  type StudioVersion,
} from '@repo/db';

export type VersionSummary = Pick<StudioVersion, 'number' | 'summary' | 'messageId' | 'createdAt'>;

@Injectable()
export class StudioRepository {
  listProjects(userId: string) {
    return db
      .select({
        id: studioProjects.id,
        name: studioProjects.name,
        version: studioProjects.currentVersion,
        lastError: studioProjects.lastError,
        pullRequestUrl: studioProjects.pullRequestUrl,
        updatedAt: studioProjects.updatedAt,
      })
      .from(studioProjects)
      .where(eq(studioProjects.userId, userId))
      .orderBy(desc(studioProjects.updatedAt))
      .limit(200);
  }

  async createProject(userId: string, name: string): Promise<StudioProject> {
    return db.transaction(async (tx) => {
      const [project] = await tx.insert(studioProjects).values({ userId, name }).returning();
      const created = project;
      await tx.insert(studioThreads).values({ projectId: created.id, messages: [] });
      return created;
    });
  }

  async findProject(userId: string, id: string): Promise<StudioProject | null> {
    const [project] = await db
      .select()
      .from(studioProjects)
      .where(and(eq(studioProjects.id, id), eq(studioProjects.userId, userId)));
    return project ?? null;
  }

  async renameProject(id: string, name: string): Promise<void> {
    await db
      .update(studioProjects)
      .set({ name, updatedAt: new Date() })
      .where(eq(studioProjects.id, id));
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(studioProjects).where(eq(studioProjects.id, id));
  }

  async listVersions(projectId: string): Promise<VersionSummary[]> {
    return db
      .select({
        number: studioVersions.number,
        summary: studioVersions.summary,
        messageId: studioVersions.messageId,
        createdAt: studioVersions.createdAt,
      })
      .from(studioVersions)
      .where(eq(studioVersions.projectId, projectId))
      .orderBy(studioVersions.number);
  }

  async findVersion(projectId: string, number: number): Promise<StudioVersion | null> {
    const [version] = await db
      .select()
      .from(studioVersions)
      .where(and(eq(studioVersions.projectId, projectId), eq(studioVersions.number, number)));
    return version ?? null;
  }

  /** Saves the next version and points the project at it, in one transaction. */
  async addVersion(input: {
    projectId: string;
    files: StudioFiles;
    summary: string;
    messageId: string | null;
    lastError: string | null;
  }): Promise<number> {
    return db.transaction(async (tx) => {
      const [project] = await tx
        .select({ version: studioProjects.currentVersion })
        .from(studioProjects)
        .where(eq(studioProjects.id, input.projectId))
        .for('update');
      const [latest] = await tx
        .select({ number: sql<number>`coalesce(max(${studioVersions.number}), 0)` })
        .from(studioVersions)
        .where(eq(studioVersions.projectId, input.projectId));
      const number = Math.max(project?.version ?? 0, Number(latest?.number ?? 0)) + 1;
      await tx.insert(studioVersions).values({
        projectId: input.projectId,
        number,
        files: input.files,
        summary: input.summary,
        messageId: input.messageId,
      });
      await tx
        .update(studioProjects)
        .set({ currentVersion: number, lastError: input.lastError, updatedAt: new Date() })
        .where(eq(studioProjects.id, input.projectId));
      return number;
    });
  }

  async touchProject(id: string): Promise<void> {
    await db.update(studioProjects).set({ updatedAt: new Date() }).where(eq(studioProjects.id, id));
  }

  async setPullRequest(id: string, url: string): Promise<void> {
    await db
      .update(studioProjects)
      .set({ pullRequestUrl: url, updatedAt: new Date() })
      .where(eq(studioProjects.id, id));
  }

  async getThread(projectId: string): Promise<unknown[]> {
    const [thread] = await db
      .select({ messages: studioThreads.messages })
      .from(studioThreads)
      .where(eq(studioThreads.projectId, projectId));
    return thread?.messages ?? [];
  }

  async saveThread(projectId: string, messages: unknown[]): Promise<void> {
    await db
      .insert(studioThreads)
      .values({ projectId, messages })
      .onConflictDoUpdate({
        target: studioThreads.projectId,
        set: { messages, updatedAt: new Date() },
      });
  }

  async usage(userId: string, day: string): Promise<{ generations: number; tokens: number }> {
    const [row] = await db
      .select({ generations: studioUsage.generations, tokens: studioUsage.tokens })
      .from(studioUsage)
      .where(and(eq(studioUsage.userId, userId), eq(studioUsage.day, day)));
    return row ?? { generations: 0, tokens: 0 };
  }

  /** Counts one generation and returns the new total for the day. */
  async addGeneration(userId: string, day: string): Promise<number> {
    const [row] = await db
      .insert(studioUsage)
      .values({ userId, day, generations: 1 })
      .onConflictDoUpdate({
        target: [studioUsage.userId, studioUsage.day],
        set: { generations: sql`${studioUsage.generations} + 1` },
      })
      .returning({ generations: studioUsage.generations });
    return row?.generations ?? 1;
  }

  async addTokens(userId: string, day: string, tokens: number): Promise<void> {
    if (tokens <= 0) return;
    await db
      .update(studioUsage)
      .set({ tokens: sql`${studioUsage.tokens} + ${tokens}` })
      .where(and(eq(studioUsage.userId, userId), eq(studioUsage.day, day)));
  }
}
