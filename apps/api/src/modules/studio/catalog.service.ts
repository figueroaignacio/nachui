import { Injectable } from '@nestjs/common';
import { CATALOG_DIR_FAMILY, catalogSlug, type CatalogDir } from '@repo/ai/studio-core';
import { RegistryRepository } from '../registry/registry.repository';

const TTL_MS = 5 * 60 * 1000;

const FAMILY_DIR: Record<string, CatalogDir> = Object.fromEntries(
  Object.entries(CATALOG_DIR_FAMILY).map(([dir, family]) => [family, dir as CatalogDir]),
);

const SUPPORT_FAMILIES = new Set(['lib', 'hooks']);

type CatalogRow = { slug: string; registryDependencies: string[] };

/** Where the CLI installs a registry item, so exports and the CLI agree. */
export function installPath(slug: string, baseDir: string): string {
  const [family = 'ui', name = slug] = slug.includes('/') ? slug.split('/') : ['ui', slug];
  const dir = FAMILY_DIR[family] ?? family;
  const extension = SUPPORT_FAMILIES.has(family) ? '.ts' : '.tsx';
  const base = baseDir.replace(/^\/+|\/+$/g, '');
  return [base, dir, `${name}${extension}`].filter(Boolean).join('/');
}

/** Import path a slug is reached by from a screen, `ui/card` → `components/card`. */
export function importPathOf(slug: string): string | null {
  const [family, name] = slug.split('/');
  const dir = family ? FAMILY_DIR[family] : undefined;
  return dir && name ? `${dir}/${name}` : null;
}

/**
 * The registry as the Studio sees it, cached for a few minutes: what can be
 * imported, the source of each file and the dependencies to ship with it.
 */
@Injectable()
export class CatalogService {
  private rows: { at: number; value: Promise<Map<string, CatalogRow>> } | null = null;
  private readonly sources = new Map<string, { at: number; value: Promise<string | null> }>();

  constructor(private readonly registry: RegistryRepository) {}

  private all(): Promise<Map<string, CatalogRow>> {
    if (!this.rows || Date.now() - this.rows.at > TTL_MS) {
      const value = this.registry
        .findAll()
        .then(
          (rows) =>
            new Map(
              rows.map((row) => [
                row.slug,
                { slug: row.slug, registryDependencies: row.registryDependencies ?? [] },
              ]),
            ),
        );
      value.catch(() => {
        this.rows = null;
      });
      this.rows = { at: Date.now(), value };
    }
    return this.rows.value;
  }

  async listImportPaths(): Promise<string[]> {
    const rows = await this.all();
    return [...rows.keys()]
      .map(importPathOf)
      .filter((path): path is string => path !== null)
      .sort();
  }

  async source(dir: CatalogDir, name: string): Promise<string | null> {
    const slug = catalogSlug(dir, name);
    const cached = this.sources.get(slug);
    if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
    const value = this.registry.findBySlug(slug).then((row) => row?.code ?? null);
    this.sources.set(slug, { at: Date.now(), value });
    return value;
  }

  /** The slugs plus everything they import, the same closure the CLI installs. */
  async closure(slugs: string[]): Promise<string[]> {
    const rows = await this.all();
    const seen = new Set<string>();
    const queue = [...slugs];
    while (queue.length > 0) {
      const slug = queue.shift() as string;
      if (seen.has(slug) || !rows.has(slug)) continue;
      seen.add(slug);
      queue.push(...(rows.get(slug)?.registryDependencies ?? []));
    }
    return [...seen].sort();
  }
}
