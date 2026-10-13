import { z } from 'zod';

export const DEFAULT_API_URL = 'https://api-nach-ui.vercel.app/api/v1';
export const REQUEST_TIMEOUT_MS = 15_000;

const stringList = z
  .array(z.string())
  .nullish()
  .transform((value) => value ?? []);

const registryItemSchema = z.object({
  name: z.string(),
  slug: z.string(),
  type: z.string().nullish(),
  code: z.string(),
  dependencies: stringList,
  registryDependencies: stringList,
});

const registryEntrySchema = registryItemSchema.omit({ code: true });

const themeSchema = z.object({
  css: z.string(),
  config: z.record(z.string(), z.unknown()),
  utils: z.string(),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryEntry = z.infer<typeof registryEntrySchema>;
export type ThemeAssets = z.infer<typeof themeSchema>;

export class ApiError extends Error {}

/** Thrown when a bare name exists in more than one family. */
export class AmbiguousComponentError extends ApiError {}

export class NotFoundError extends ApiError {}

/** The registry base URL, overridable with `NACHUI_API_URL` for local or self-hosted APIs. */
export function apiUrl(env: NodeJS.ProcessEnv = process.env): string {
  const raw = env.NACHUI_API_URL?.trim() || DEFAULT_API_URL;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ApiError(`NACHUI_API_URL is not a valid URL: ${raw}`);
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new ApiError(`NACHUI_API_URL must use http or https: ${raw}`);
  }

  return url.toString().replace(/\/+$/, '');
}

async function messageFrom(response: Response): Promise<string | undefined> {
  const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
  return typeof body?.message === 'string' ? body.message : undefined;
}

async function request<T>(pathname: string, schema: z.ZodType<T>): Promise<T> {
  const base = apiUrl();
  let response: Response;
  let body: unknown;

  try {
    response = await fetch(`${base}${pathname}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const message = await messageFrom(response);
      if (response.status === 409) throw new AmbiguousComponentError(message ?? 'Ambiguous name.');
      if (response.status === 404) throw new NotFoundError(message ?? 'Not found.');
      throw new ApiError(message ?? `The registry answered ${response.status}.`);
    }

    body = await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new ApiError(
        `The NachUI registry at ${base} did not answer within ${REQUEST_TIMEOUT_MS / 1000}s.`,
      );
    }
    const reason = error instanceof Error ? error.message : String(error);
    throw new ApiError(`Could not reach the NachUI registry at ${base}: ${reason}`);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(`The registry at ${base} sent an unexpected response for ${pathname}.`);
  }
  return parsed.data;
}

export const api = {
  getComponents(): Promise<RegistryEntry[]> {
    return request('/registry', z.array(registryEntrySchema));
  },

  getComponent(slug: string): Promise<RegistryItem> {
    const path = slug.split('/').map(encodeURIComponent).join('/');
    return request(`/registry/${path}`, registryItemSchema);
  },

  getTheme(theme: string = 'default'): Promise<ThemeAssets> {
    return request(`/themes/${encodeURIComponent(theme)}`, themeSchema);
  },

  getThemes(): Promise<string[]> {
    return request('/themes', z.array(z.string()));
  },
};
