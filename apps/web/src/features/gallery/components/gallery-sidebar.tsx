'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { Link, usePathname } from '@/i18n/navigation';
import { Input } from '@repo/ui/components/input';
import { SearchIcon } from '@repo/ui/icons/search';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { countGalleryExamples, getGalleryComponents, humanize } from '../lib/gallery-registry';
import { useDocsItems } from '../lib/use-docs-items';

const linkClassName = (isActive: boolean) =>
  cn(
    'flex items-center gap-2 rounded-md px-2.5 py-1 text-[13px] transition-colors',
    isActive
      ? 'bg-card text-foreground font-medium'
      : 'text-muted-foreground hover:text-foreground',
  );

export function GallerySidebar() {
  const t = useTranslations('sections.gallery');
  const pathname = usePathname();
  const docItems = useDocsItems();
  const [filter, setFilter] = useState('');

  const entries = getGalleryComponents()
    .map((entry) => {
      const doc = docItems.find((item) => item.href === entry.docsHref);
      return {
        slug: entry.slug,
        title: doc?.title ?? humanize(entry.slug),
        badge: doc?.badge,
        count: entry.examples.length,
      };
    })
    .filter((entry) => entry.title.toLowerCase().includes(filter.trim().toLowerCase()));

  const isIndex = pathname === '/components';

  return (
    <aside className="lg:border-r lg:pr-8">
      <nav
        aria-label={t('eyebrow')}
        className="hide-scrollbar sticky top-10 hidden h-[calc(100vh-9rem)] shrink-0 overflow-y-scroll mask-[linear-gradient(180deg,black_90%,transparent)] pt-6 pb-20 lg:block"
      >
        <Input
          size="sm"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={t('filter')}
          aria-label={t('filter')}
          leftIcon={<SearchIcon size={14} />}
          className="mb-3"
        />
        <ul>
          <li>
            <Link
              href="/components"
              aria-current={isIndex ? 'page' : undefined}
              className={linkClassName(isIndex)}
            >
              <span className="flex-1">{t('back')}</span>
              <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                {countGalleryExamples()}
              </span>
            </Link>
          </li>
          {entries.map((entry) => {
            const href = `/components/${entry.slug}`;
            const isActive = pathname === href;
            return (
              <li key={entry.slug}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={linkClassName(isActive)}
                >
                  <span className="flex-1 truncate">{entry.title}</span>
                  <NavBadge badge={entry.badge} />
                  <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                    {entry.count}
                  </span>
                </Link>
              </li>
            );
          })}
          {entries.length === 0 && (
            <li className="text-muted-foreground px-2.5 py-1.5 text-sm">{t('noResults')}</li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
