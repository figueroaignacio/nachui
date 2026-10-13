import type { RegistryItem } from './api.js';

/**
 * Fetches the requested items and, recursively, every item they list in
 * `registryDependencies`. Each slug is fetched once, both as requested and
 * as the canonical slug the registry answers with, so `button` and
 * `ui/button` dedupe and import cycles terminate.
 *
 * Items come back in discovery order: the requested ones first, then their
 * dependencies level by level.
 */
export async function resolveTree(
  slugs: string[],
  fetchItem: (slug: string) => Promise<RegistryItem>,
): Promise<RegistryItem[]> {
  const items = new Map<string, RegistryItem>();
  const requested = new Set<string>();
  let frontier = [...new Set(slugs.map((s) => s.trim().toLowerCase()))];

  while (frontier.length > 0) {
    for (const slug of frontier) requested.add(slug);

    const fetched = await Promise.all(frontier.map((slug) => fetchItem(slug)));
    const next: string[] = [];

    for (const item of fetched) {
      if (items.has(item.slug)) continue;
      items.set(item.slug, item);
      requested.add(item.slug);

      for (const dependency of item.registryDependencies) {
        const slug = dependency.toLowerCase();
        if (!requested.has(slug) && !next.includes(slug)) next.push(slug);
      }
    }

    frontier = next;
  }

  return [...items.values()];
}

/** The union of npm packages every item in the tree needs, sorted. */
export function collectNpmDependencies(items: RegistryItem[]): string[] {
  return [...new Set(items.flatMap((item) => item.dependencies))].sort();
}
