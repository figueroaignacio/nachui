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
  API_URL: z.url().optional(),
  STUDIO_URL: z.url().optional(),
  GITHUB_CLIENT_ID: z.string().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  STUDIO_SECRET: z.string().min(32, 'needs at least 32 characters').optional(),
  STUDIO_DAILY_LIMIT: z.coerce.number().int().positive().default(20),
});

export type Env = z.infer<typeof envSchema>;

const STUDIO_KEYS = [
  'STUDIO_URL',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'STUDIO_SECRET',
] as const;

export type StudioConfig = {
  apiUrl: string;
  studioUrl: string;
  githubClientId: string;
  githubClientSecret: string;
  secret: string;
  dailyLimit: number;
};

/**
 * The Studio is optional: without its four variables the API boots as before
 * and the Studio routes answer 503. Setting only some of them is a mistake,
 * so validation fails and names the missing ones.
 */
export function studioConfig(env: Env): StudioConfig | null {
  const present = STUDIO_KEYS.filter((key) => env[key] !== undefined);
  if (present.length === 0) return null;

  return {
    apiUrl: env.API_URL ?? `http://localhost:${env.PORT}`,
    studioUrl: env.STUDIO_URL as string,
    githubClientId: env.GITHUB_CLIENT_ID as string,
    githubClientSecret: env.GITHUB_CLIENT_SECRET as string,
    secret: env.STUDIO_SECRET as string,
    dailyLimit: env.STUDIO_DAILY_LIMIT,
  };
}

const checkedSchema = envSchema.superRefine((env, ctx) => {
  const present = STUDIO_KEYS.filter((key) => env[key] !== undefined);
  if (present.length === 0 || present.length === STUDIO_KEYS.length) return;
  for (const key of STUDIO_KEYS) {
    if (env[key] === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: [key],
        message:
          'the Studio needs STUDIO_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET and STUDIO_SECRET together',
      });
    }
  }
});

/** `ConfigModule` validator: the api refuses to boot with a broken env. */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = checkedSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }

  return result.data;
}
