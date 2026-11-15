'use client';

import { useEffect, useMemo, useState } from 'react';
import { CodeBlock } from '@/shared/components/mdx/codeblock';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@repo/ui/components/button';
import { Dialog } from '@repo/ui/components/dialog';
import { Drawer } from '@repo/ui/components/drawer';
import { Input } from '@repo/ui/components/input';
import { CheckIcon } from '@repo/ui/icons/check';
import { CopyIcon } from '@repo/ui/icons/copy';
import { FilterIcon } from '@repo/ui/icons/filter';
import { SearchIcon } from '@repo/ui/icons/search';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import type { CatalogIcon } from '../lib/get-icon-catalog';
import { ICON_CATEGORIES, type IconCategory, iconCliCommand, iconUsageSnippet } from '../lib/icons';
import { ICON_COMPONENTS } from '../lib/icon-registry';

const SIZES = [16, 20, 24, 32] as const;
const STROKES = [1, 1.5, 2] as const;
const RELATED_COUNT = 8;

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
    <div className="flex flex-col gap-2">
      <span className="section-label px-2.5">{label}</span>
      <div
        role="group"
        aria-label={label}
        className="border-border flex w-fit gap-0.5 rounded-full border p-0.5"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={cn(
              'focus-visible:ring-ring h-7 min-w-9 rounded-full px-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
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

interface FiltersProps {
  category: CategoryFilter;
  counts: Record<CategoryFilter, number>;
  size: Size;
  stroke: Stroke;
  onCategoryChange: (category: CategoryFilter) => void;
  onSizeChange: (size: Size) => void;
  onStrokeChange: (stroke: Stroke) => void;
}

function Filters({
  category,
  counts,
  size,
  stroke,
  onCategoryChange,
  onSizeChange,
  onStrokeChange,
}: FiltersProps) {
  const t = useTranslations('sections.icons');

  return (
    <div className="flex flex-col gap-6">
      <div role="radiogroup" aria-label={t('filter')} className="flex flex-col gap-0.5">
        <span className="section-label px-2.5 pb-2">{t('filter')}</span>
        {(['all', ...ICON_CATEGORIES] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={category === key}
            onClick={() => onCategoryChange(key)}
            className={cn(
              'focus-visible:ring-ring flex h-8 items-center justify-between rounded-sm px-2.5 text-start text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none max-lg:h-11',
              category === key
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span>{key === 'all' ? t('all') : t(`categories.${key}`)}</span>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {counts[key]}
            </span>
          </button>
        ))}
      </div>
      <Segmented label={t('size')} options={SIZES} value={size} onChange={onSizeChange} />
      <Segmented label={t('stroke')} options={STROKES} value={stroke} onChange={onStrokeChange} />
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const t = useTranslations('sections.icons');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => setCopied(true));
      }}
      leftIcon={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
    >
      {copied ? t('copied') : label}
    </Button>
  );
}

function IconDetail({
  icon,
  related,
  stroke,
  onSelect,
  onClose,
}: {
  icon: CatalogIcon | null;
  related: CatalogIcon[];
  stroke: Stroke;
  onSelect: (icon: CatalogIcon) => void;
  onClose: () => void;
}) {
  const t = useTranslations('sections.icons');
  const Component = icon ? ICON_COMPONENTS[icon.name] : undefined;

  return (
    <Dialog open={icon !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content className="max-w-3xl">
        {icon && Component && (
          <>
            <Dialog.Header>
              <Dialog.Title className="font-mono text-base font-medium">{icon.name}</Dialog.Title>
              <Dialog.Description>
                {icon.componentName} · {t(`categories.${icon.category}`)}
              </Dialog.Description>
            </Dialog.Header>

            <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
              <div className="border-border bg-surface-muted text-foreground flex aspect-square items-center justify-center rounded-md border max-sm:aspect-auto max-sm:h-36">
                <Component size={64} strokeWidth={stroke} />
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <span className="section-label">{t('install')}</span>
                <CodeBlock
                  language="bash"
                  showLineNumbers={false}
                  code={iconCliCommand(icon.name)}
                />
                <span className="section-label mt-1">{t('use')}</span>
                <CodeBlock
                  language="tsx"
                  showLineNumbers={false}
                  code={iconUsageSnippet(icon.name)}
                />
                <div className="mt-1 flex flex-wrap gap-2">
                  <CopyButton text={icon.jsx} label={t('copyJsx')} />
                  <CopyButton text={icon.svg} label={t('copySvg')} />
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="border-border flex flex-col gap-2.5 border-t pt-4">
                <span className="section-label">
                  {t('related', { category: t(`categories.${icon.category}`) })}
                </span>
                <div className="flex flex-wrap gap-2">
                  {related.map((item) => {
                    const Related = ICON_COMPONENTS[item.name];
                    if (!Related) return null;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        title={item.name}
                        aria-label={item.name}
                        onClick={() => onSelect(item)}
                        className="border-border text-foreground hover:border-border-interactive hover:bg-surface-muted focus-visible:ring-ring flex size-11 items-center justify-center rounded-sm border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <Related size={18} strokeWidth={stroke} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </Dialog.Content>
    </Dialog>
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const matching = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return icons;
    return icons.filter(
      (icon) =>
        icon.name.includes(needle) ||
        icon.componentName.toLowerCase().includes(needle) ||
        icon.tags.some((tag) => tag.includes(needle)),
    );
  }, [icons, query]);

  const counts = useMemo(() => {
    const result = { all: matching.length } as Record<CategoryFilter, number>;
    for (const key of ICON_CATEGORIES) {
      result[key] = matching.filter((icon) => icon.category === key).length;
    }
    return result;
  }, [matching]);

  const visible = useMemo(() => {
    const filtered =
      category === 'all' ? matching : matching.filter((icon) => icon.category === category);
    return [...filtered].sort(
      (a, b) => ICON_CATEGORIES.indexOf(a.category) - ICON_CATEGORIES.indexOf(b.category),
    );
  }, [matching, category]);

  const related = useMemo(
    () =>
      selected
        ? icons
            .filter((icon) => icon.category === selected.category && icon.name !== selected.name)
            .slice(0, RELATED_COUNT)
        : [],
    [icons, selected],
  );

  const filters = (
    <Filters
      category={category}
      counts={counts}
      size={size}
      stroke={stroke}
      onCategoryChange={(next) => {
        setCategory(next);
        setFiltersOpen(false);
      }}
      onSizeChange={setSize}
      onStrokeChange={setStroke}
    />
  );

  const categoryLabel = category === 'all' ? t('all') : t(`categories.${category}`);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--site-header-height)+1.5rem)]">{filters}</div>
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('search')}
              aria-label={t('search')}
              leftIcon={<SearchIcon size={16} />}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            leftIcon={<FilterIcon size={15} />}
            className="max-md:h-11 lg:hidden"
          >
            {t('filters')}
          </Button>
        </div>
        <p role="status" className="text-muted-foreground text-xs">
          {categoryLabel} · {t('count', { count: visible.length })}
        </p>

        {visible.length === 0 ? (
          <p className="text-muted-foreground py-16 text-center text-sm">{t('empty')}</p>
        ) : (
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(6.75rem,1fr))]">
            {visible.map((icon) => {
              const Component = ICON_COMPONENTS[icon.name];
              if (!Component) return null;
              return (
                <li key={icon.name}>
                  <button
                    type="button"
                    onClick={() => setSelected(icon)}
                    title={icon.name}
                    className="border-border hover:border-border-interactive hover:bg-surface-muted focus-visible:ring-ring group flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span className="text-foreground flex h-9 items-center justify-center">
                      <Component size={size} strokeWidth={stroke} />
                    </span>
                    <span className="text-muted-foreground group-hover:text-foreground w-full truncate px-1.5 font-mono text-xs max-sm:hidden">
                      {icon.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <Drawer.Content side="bottom" className="lg:hidden">
          <Drawer.Header>
            <Drawer.Title>{t('filters')}</Drawer.Title>
          </Drawer.Header>
          <div className="pb-4">{filters}</div>
        </Drawer.Content>
      </Drawer>

      <IconDetail
        icon={selected}
        related={related}
        stroke={stroke}
        onSelect={setSelected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
