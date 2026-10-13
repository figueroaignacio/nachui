import { z } from 'zod';

const urlList = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.url()).min(1, 'needs at least one URL'));

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  POSTGRES_URL: z.url(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  FRONTEND_URLS: urlList,
  PORTFOLIO_URL: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

/** `ConfigModule` validator: the api refuses to boot with a broken env. */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }

  return result.data;
}
