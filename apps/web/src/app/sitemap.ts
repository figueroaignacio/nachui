import { BRICK_CATEGORIES } from '@/features/bricks/lib/bricks-registry';
import { getAllGallerySlugs } from '@/features/gallery/lib/gallery-registry';
import { CAST } from '@/features/sprites/lib/cast';
import { ContentRepository } from '@/lib/content-repository';
import { LOCALES, type Locale } from '@/lib/constants';
import { buildAlternates, getAbsoluteUrl } from '@/lib/domains';
import type { MetadataRoute } from 'next';

type SitemapEntry = MetadataRoute.Sitemap[number];

interface EntryOptions {
  changeFrequency: SitemapEntry['changeFrequency'];
  priority: number;
  /** Only set when the real date is known; a build timestamp tells crawlers nothing. */
  lastModified?: Date;
}

function entry(locale: Locale, path: string, options: EntryOptions): SitemapEntry {
  return {
    url: getAbsoluteUrl(locale, path),
    ...(options.lastModified && { lastModified: options.lastModified }),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: buildAlternates(path),
    },
  };
}

const STATIC_PAGES: [path: string, options: EntryOptions][] = [
  ['/', { changeFrequency: 'weekly', priority: 1 }],
  ['/docs', { changeFrequency: 'weekly', priority: 0.9 }],
  ['/components', { changeFrequency: 'weekly', priority: 0.9 }],
  ['/bricks', { changeFrequency: 'weekly', priority: 0.9 }],
  ['/icons', { changeFrequency: 'weekly', priority: 0.8 }],
  ['/sprites', { changeFrequency: 'monthly', priority: 0.6 }],
  ['/about', { changeFrequency: 'monthly', priority: 0.7 }],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) => {
    const staticPages = STATIC_PAGES.map(([path, options]) => entry(locale, path, options));

    const docPages = ContentRepository.getDocs(locale)
      .filter((doc) => doc.published && doc.slugAsParams !== '')
      .map((doc) =>
        entry(locale, `/docs/${doc.slugAsParams}`, {
          changeFrequency: 'weekly',
          priority: 0.8,
          lastModified: doc.date ? new Date(doc.date) : undefined,
        }),
      );

    const brickPages = BRICK_CATEGORIES.map((category) =>
      entry(locale, `/bricks/${category.slug}`, { changeFrequency: 'weekly', priority: 0.8 }),
    );

    const componentPages = getAllGallerySlugs().map((slug) =>
      entry(locale, `/components/${slug}`, { changeFrequency: 'weekly', priority: 0.7 }),
    );

    const spritePages = CAST.map((member) =>
      entry(locale, `/sprites/${member.id}`, { changeFrequency: 'monthly', priority: 0.4 }),
    );

    return [...staticPages, ...docPages, ...brickPages, ...componentPages, ...spritePages];
  });
}
