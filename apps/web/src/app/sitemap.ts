import { allDocs as docs, allSkills as skills } from 'content-collections';
import { BRICK_CATEGORIES } from '@/features/bricks/lib/bricks-registry';
import { buildAlternates, getDomainForLocale, locales } from '@/lib/domains';
import type { MetadataRoute } from 'next';

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  locale: string,
  path: string,
  opts: { changeFrequency: SitemapEntry['changeFrequency']; priority: number; lastModified?: Date },
): SitemapEntry {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return {
    url: `${getDomainForLocale(locale)}${cleanPath}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: buildAlternates(cleanPath),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    entry(locale, '/', { changeFrequency: 'daily', priority: 1 }),
    entry(locale, '/docs', { changeFrequency: 'weekly', priority: 0.9 }),
    entry(locale, '/docs/components', { changeFrequency: 'weekly', priority: 0.9 }),
    entry(locale, '/about', { changeFrequency: 'monthly', priority: 0.7 }),
    entry(locale, '/skills', { changeFrequency: 'weekly', priority: 0.8 }),
    entry(locale, '/bricks', { changeFrequency: 'daily', priority: 0.9 }),
  ]);

  const docPages: MetadataRoute.Sitemap = docs
    .filter((doc) => doc.published)
    .flatMap((doc) => {
      return locales.map((locale) => {
        const localizedDoc = docs.find((d) => d.locale === locale && d.slug === doc.slug);
        const slugPath = localizedDoc?.slugAsParams || doc.slugAsParams || '';

        return entry(locale, `/docs/${slugPath}`, {
          changeFrequency: 'weekly',
          priority: 0.8,
          lastModified: localizedDoc?.date ? new Date(localizedDoc.date) : undefined,
        });
      });
    });

  const skillPages: MetadataRoute.Sitemap = skills.flatMap((skill) => {
    return locales.map((locale) => {
      return entry(locale, `/skills/${skill.slug}`, {
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  const brickPages: MetadataRoute.Sitemap = BRICK_CATEGORIES.flatMap((category) => {
    return locales.map((locale) => {
      return entry(locale, `/bricks/${category.slug}`, {
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  const allPages = [...staticPages, ...docPages, ...skillPages, ...brickPages];
  const uniquePages = Array.from(new Map(allPages.map((page) => [page.url, page])).values());

  return uniquePages;
}
