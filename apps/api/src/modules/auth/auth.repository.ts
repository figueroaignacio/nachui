import { Injectable } from '@nestjs/common';
import { and, db, eq, gt, studioSessions, studioUsers, type StudioUser } from '@repo/db';

export type GithubProfile = {
  githubId: string;
  login: string;
  name: string | null;
  avatarUrl: string | null;
};

@Injectable()
export class AuthRepository {
  async upsertUser(profile: GithubProfile): Promise<StudioUser> {
    const [user] = await db
      .insert(studioUsers)
      .values(profile)
      .onConflictDoUpdate({
        target: studioUsers.githubId,
        set: {
          login: profile.login,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createSession(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await db.insert(studioSessions).values({ tokenHash, userId, expiresAt });
  }

  async findUserBySession(tokenHash: string): Promise<StudioUser | null> {
    const [row] = await db
      .select({ user: studioUsers })
      .from(studioSessions)
      .innerJoin(studioUsers, eq(studioSessions.userId, studioUsers.id))
      .where(
        and(eq(studioSessions.tokenHash, tokenHash), gt(studioSessions.expiresAt, new Date())),
      );
    return row?.user ?? null;
  }

  async deleteSession(tokenHash: string): Promise<void> {
    await db.delete(studioSessions).where(eq(studioSessions.tokenHash, tokenHash));
  }

  async setRepoToken(userId: string, encrypted: string | null): Promise<void> {
    await db
      .update(studioUsers)
      .set({ repoToken: encrypted, updatedAt: new Date() })
      .where(eq(studioUsers.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(studioUsers).where(eq(studioUsers.id, userId));
  }
}
