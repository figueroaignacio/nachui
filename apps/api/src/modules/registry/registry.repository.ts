import { Injectable } from '@nestjs/common';
import { Component, components, db, eq, like, NewComponent } from '@repo/db';

/** What a short-form lookup found. Ambiguity is a result, not an error. */
export type SlugResolution =
  | { status: 'found'; component: Component }
  | { status: 'not-found' }
  | { status: 'ambiguous'; candidates: string[] };

@Injectable()
export class RegistryRepository {
  async findAll() {
    return await db
      .select({
        name: components.name,
        slug: components.slug,
        type: components.type,
        dependencies: components.dependencies,
      })
      .from(components);
  }

  /** Exact lookup by qualified slug, `ui/button`. */
  async findBySlug(slug: string): Promise<Component | undefined> {
    const [result] = await db
      .select()
      .from(components)
      .where(eq(components.slug, slug.toLowerCase()));
    return result;
  }

  /**
   * Lookup by bare component name, `button`.
   *
   * Slugs are qualified as `family/name`, but the published CLI sends the bare
   * name and users type it, so it has to keep resolving. It only fails when the
   * name genuinely exists in more than one family, which is the case the
   * qualified slug was introduced for.
   */
  async resolve(input: string): Promise<SlugResolution> {
    const value = input.toLowerCase();

    if (value.includes('/')) {
      const component = await this.findBySlug(value);
      return component ? { status: 'found', component } : { status: 'not-found' };
    }

    const matches = await db
      .select()
      .from(components)
      .where(like(components.slug, `%/${value}`));

    // Rows predating the qualified-slug migration still carry the bare name.
    if (matches.length === 0) {
      const legacy = await this.findBySlug(value);
      return legacy ? { status: 'found', component: legacy } : { status: 'not-found' };
    }

    if (matches.length > 1) {
      return { status: 'ambiguous', candidates: matches.map((m) => m.slug).sort() };
    }

    return { status: 'found', component: matches[0]! };
  }

  async upsert(data: NewComponent) {
    return await db
      .insert(components)
      .values(data)
      .onConflictDoUpdate({
        target: components.slug,
        set: { ...data, updatedAt: new Date() },
      });
  }
}
