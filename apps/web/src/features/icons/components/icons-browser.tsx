'use client';

import { useEffect, useMemo, useState } from 'react';
import { CodeBlock } from '@/shared/components/mdx/codeblock';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Badge } from '@repo/ui/components/badge';
import { Drawer } from '@repo/ui/components/drawer';
import { Input } from '@repo/ui/components/input';
import { SearchIcon } from '@repo/ui/icons/search';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import type { CatalogIcon } from '../lib/get-icon-catalog';
import { ICON_CATEGORIES, type IconCategory, iconCliCommand, iconUsageSnippet } from '../lib/icons';
import { ICON_COMPONENTS } from '../lib/icon-registry';

const SIZES = [16, 20, 24, 32] as const;
const STROKES = [1, 1.5, 2] as const;

type Size = (typeof SIZES)[number];
type Stroke = (typeof STROKES)[number];
type CategoryFilter = IconCategory | 'all';

const QUERY_PARAM = 'q';
const CATEGORY_PARAM = 'category';

function isCategory(value: string | null): value is IconCategory {
  return value !== null && (ICON_CATEGORIES as readonly string[]).includes(value);
}

function Segmented<T extends number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground font-mono text-[0.68rem] tracking-widest uppercase">
        {label}
      </span>
      <div
        role="group"
        aria-label={label}
        className="border-border bg-card inline-flex rounded-md border p-0.5"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={cn(
              'focus-visible:ring-ring rounded-sm px-2 py-0.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
              option === value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function IconDetail({ icon, onClose }: { icon: CatalogIcon | null; onClose: () => void }) {
  const t = useTranslations('sections.icons');
  const Component = icon ? ICON_COMPONENTS[icon.name] : undefined;

  return (
    <Drawer open={icon !== null} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Content
        side="right"
        showDragHandle={false}
        className="w-[92vw] sm:w-[36rem] lg:w-[42rem]"
      >
        {icon && Component && (
          <>
            <Drawer.Header>
              <div className="flex items-center gap-4">
                <span className="border-border bg-surface-muted text-foreground flex size-16 shrink-0 items-center justify-center rounded-lg border">
                  <Component size={32} />
                </span>
                <div className="min-w-0">
                  <Drawer.Title className="font-mono text-base">{icon.name}</Drawer.Title>
                  <Drawer.Description className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">
                      {t(`categories.${icon.category}`)}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{icon.componentName}</span>
                  </Drawer.Description>
                </div>
              </div>
            </Drawer.Header>

            <div className="flex flex-col gap-3">
              <CodeBlock language="bash" showLineNumbers={false} code={iconCliCommand(icon.name)} />
              <CodeBlock
                language="tsx"
                showLineNumbers={false}
                code={iconUsageSnippet(icon.name)}
              />
              <CodeBlock language="tsx" code={icon.jsx} />
              <CodeBlock language="markup" code={icon.svg} />
            </div>
          </>
        )}
      </Drawer.Content>
    </Drawer>
  );
}

export function IconsBrowser({ icons }: { icons: CatalogIcon[] }) {
  const t = useTranslations('sections.icons');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get(CATEGORY_PARAM);
  const [query, setQuery] = useState(searchParams.get(QUERY_PARAM) ?? '');
  const [category, setCategory] = useState<CategoryFilter>(
    isCategory(initialCategory) ? initialCategory : 'all',
  );
  const [size, setSize] = useState<Size>(24);
  const [stroke, setStroke] = useState<Stroke>(1.5);
  const [selected, setSelected] = useState<CatalogIcon | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();
    if (trimmed) params.set(QUERY_PARAM, trimmed);
    else params.delete(QUERY_PARAM);
    if (category === 'all') params.delete(CATEGORY_PARAM);
    else params.set(CATEGORY_PARAM, category);

    const next = params.toString();
    if (next === searchParams.toString()) return;
    const timer = setTimeout(() => {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }, 150);
    return () => clearTimeout(timer);
  }, [query, category, pathname, router, searchParams]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return icons.filter((icon) => {
      if (category !== 'all' && icon.category !== category) return false;
      if (!needle) return true;
      return (
        icon.name.includes(needle) ||
        icon.componentName.toLowerCase().includes(needle) ||
        icon.tags.some((tag) => tag.includes(needle))
      );
    });
  }, [icons, query, category]);

  const grouped = useMemo(
    () =>
      ICON_CATEGORIES.map((key) => ({
        key,
        icons: visible.filter((icon) => icon.category === key),
      })).filter((group) => group.icons.length > 0),
    [visible],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('search')}
          aria-label={t('search')}
          leftIcon={<SearchIcon size={16} />}
        />
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('filter')}>
            {(['all', ...ICON_CATEGORIES] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={category === key}
                onClick={() => setCategory(key)}
                className={cn(
                  'focus-visible:ring-ring rounded-full border px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  category === key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-border-interactive',
                )}
              >
                {key === 'all' ? t('all') : t(`categories.${key}`)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Segmented label={t('size')} options={SIZES} value={size} onChange={setSize} />
            <Segmented label={t('stroke')} options={STROKES} value={stroke} onChange={setStroke} />
          </div>
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center text-sm">{t('empty')}</p>
      ) : (
        grouped.map((group) => (
          <section key={group.key} aria-labelledby={`icons-${group.key}`}>
            <div className="mb-3 flex items-baseline gap-2">
              <h2 id={`icons-${group.key}`} className="text-sm font-medium">
                {t(`categories.${group.key}`)}
              </h2>
              <span className="text-muted-foreground font-mono text-[0.68rem]">
                {group.icons.length}
              </span>
            </div>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {group.icons.map((icon) => {
                const Component = ICON_COMPONENTS[icon.name];
                if (!Component) return null;
                return (
                  <li key={icon.name}>
                    <button
                      type="button"
                      onClick={() => setSelected(icon)}
                      title={icon.name}
                      className="border-border bg-card hover:border-border-interactive hover:bg-surface-muted focus-visible:ring-ring group flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <span className="text-foreground flex h-9 items-center justify-center">
                        <Component size={size} strokeWidth={stroke} />
                      </span>
                      <span className="text-muted-foreground group-hover:text-foreground w-full truncate px-2 font-mono text-[0.62rem]">
                        {icon.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}

      <IconDetail icon={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
