import { z } from 'zod';

const ingestEnvSchema = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  FRONTEND_URL: z.url().default('http://localhost:3000'),
});

export type IngestEnv = z.infer<typeof ingestEnvSchema>;

/** Env the ingest script needs. `POSTGRES_URL` is checked by `@repo/db`. */
export function getIngestEnv(source: NodeJS.ProcessEnv = process.env): IngestEnv {
  const result = ingestEnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Missing or invalid env vars: ${JSON.stringify(z.flattenError(result.error).fieldErrors)}`,
    );
  }
  return result.data;
}
