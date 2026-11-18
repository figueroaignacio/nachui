'use client';

import { Input } from '@repo/ui/components/input';
import { SearchIcon } from '@repo/ui/icons/search';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { CatalogGroup } from '../lib/catalog';
import { CatalogTile } from './catalog-tile';
import { IconsTile } from './icons-tile';

const ICONS = 'icons';
const ALL = 'all';

interface CatalogBrowserProps {
  groups: CatalogGroup[];
  iconCount: number;
}

/**
 * The whole catalog on one page: a search field, one filter per family and a
 * grid of live tiles under each family heading.
 */
export function CatalogBrowser({ groups, iconCount }: CatalogBrowserProps) {
  const t = useTranslations('sections.catalog');
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<string>(ALL);

  const total = groups.reduce((sum, group) => sum + group.entries.length, 0) + iconCount;
  const normalized = query.trim().toLowerCase();
  const matches = (text: string) => text.toLowerCase().includes(normalized);

  const visibleGroups = groups
    .filter((group) => family === ALL || family === group.id)
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) =>
        matches(`${entry.title} ${entry.description ?? ''}`),
      ),
    }))
    .filter((group) => group.entries.length > 0);
  const showIcons = (family === ALL || family === ICONS) && matches(t('filters.icons'));
  const isEmpty = visibleGroups.length === 0 && !showIcons;

  const filters = [
    { id: ALL, label: t('filters.all'), count: total },
    ...groups.map((group) => ({ id: group.id, label: group.title, count: group.entries.length })),
    { id: ICONS, label: t('filters.icons'), count: iconCount },
  ];

  return (
    <div className="mx-auto w-full max-w-[70rem] pt-10 pb-24 sm:pt-14">
      <h1 className="font-heading text-foreground text-3xl leading-[1.1] font-semibold tracking-[-0.03em] lg:text-4xl">
        {t('title')}
        <span aria-hidden="true" className="bg-brand ms-[0.05em] inline-block size-[0.16em]" />
      </h1>
      <p className="text-muted-strong mt-3 max-w-[52ch] text-lg leading-relaxed text-pretty md:text-xl">
        {t('description')}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-72">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search', { count: total })}
            aria-label={t('search', { count: total })}
            leftIcon={<SearchIcon size={15} />}
          />
        </div>
        <div
          role="group"
          aria-label={t('filterLabel')}
          className="hide-scrollbar -mx-(--frame-pad) flex gap-2 overflow-x-auto px-(--frame-pad) py-1 sm:mx-0 sm:px-0"
        >
          {filters.map((filter) => {
            const active = filter.id === family;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFamily(filter.id)}
                className={cn(
                  'focus-visible:ring-ring focus-visible:ring-offset-background flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  active
                    ? 'bg-inverse text-inverse-foreground border-transparent font-medium'
                    : 'bg-card border-border text-muted-strong hover:border-border-interactive hover:text-foreground',
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    'font-mono text-xs tabular-nums',
                    !active && 'text-muted-foreground',
                  )}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visibleGroups.map((group) => (
        <section key={group.id} aria-labelledby={`catalog-${group.id}`} className="mt-12">
          <h2
            id={`catalog-${group.id}`}
            className="text-foreground flex items-baseline gap-2.5 text-lg font-medium"
          >
            {group.title}
            <span className="text-brand-text font-mono text-sm tabular-nums">
              {group.entries.length}
            </span>
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.entries.map((entry) => (
              <CatalogTile key={entry.href} entry={entry} />
            ))}
          </div>
        </section>
      ))}

      {showIcons && (
        <section aria-labelledby="catalog-icons" className="mt-12">
          <h2
            id="catalog-icons"
            className="text-foreground flex items-baseline gap-2.5 text-lg font-medium"
          >
            {t('filters.icons')}
            <span className="text-brand-text font-mono text-sm tabular-nums">{iconCount}</span>
          </h2>
          <IconsTile caption={t('iconsCaption')} className="mt-4" />
        </section>
      )}

      {isEmpty && (
        <p role="status" className="text-muted-foreground mt-12 text-sm">
          {t('noResults')}
        </p>
      )}
    </div>
  );
}
