import { Injectable } from '@nestjs/common';
import { db, sql } from '@repo/db';

export type DatabaseStatus =
  | { status: 'up'; latencyMs: number }
  | { status: 'down'; latencyMs: number; error: string };

const DEFAULT_TIMEOUT_MS = 2_000;

@Injectable()
export class DatabaseHealth {
  /** Runs `select 1` and reports honestly, giving up after `timeoutMs`. */
  async check(timeoutMs = DEFAULT_TIMEOUT_MS): Promise<DatabaseStatus> {
    const startedAt = Date.now();
    let timer: NodeJS.Timeout | undefined;

    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    try {
      await Promise.race([db.execute(sql`select 1`), timeout]);
      return { status: 'up', latencyMs: Date.now() - startedAt };
    } catch (error) {
      return {
        status: 'down',
        latencyMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : 'unknown error',
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
