import { Link } from '@/i18n/navigation';
import type { DocBadge, DocSection, SearchResultItem } from '@/lib/definitions';
import { Dialog } from '@repo/ui/components/dialog';
import { Empty } from '@repo/ui/components/empty';
import { SearchIcon } from '@repo/ui/icons/search';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  navigation: DocSection[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  listboxId: string;
  optionId: (index: number) => string;
}

function ResultItem({
  id,
  href,
  title,
  isActive,
  meta,
  badge,
  onPointerMove,
}: {
  id: string;
  href: string;
  title: string;
  isActive: boolean;
  meta?: string;
  badge?: DocBadge;
  onPointerMove: () => void;
}) {
  const tBadges = useTranslations('docs.badges');
  return (
    <li id={id} role="option" aria-selected={isActive}>
      <Dialog.Close className="h-full w-full text-start outline-none">
        <Link
          href={href}
          data-active={isActive}
          onPointerMove={onPointerMove}
          className={cn(
            'flex h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-[15px] transition-colors',
            isActive ? 'bg-secondary text-foreground font-medium' : 'text-muted-strong',
          )}
        >
          <span className="min-w-0 flex-1 truncate">{title}</span>
          {badge ? (
            <span className="text-brand shrink-0 text-xs font-medium">{tBadges(badge)}</span>
          ) : null}
          {meta && <span className="text-muted-foreground shrink-0 text-[13px]">{meta}</span>}
        </Link>
      </Dialog.Close>
    </li>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <p className="text-muted-foreground px-3 pt-3 pb-1.5 text-[13px]">{label}</p>;
}

export function SearchResults({
  query,
  results,
  navigation,
  selectedIndex,
  onSelect,
  listboxId,
  optionId,
}: SearchResultsProps) {
  const t = useTranslations('components.searcher');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = containerRef.current?.querySelector('[data-active="true"]');
    if (activeElement) {
      activeElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (query && results.length === 0) {
    return (
      <Empty className="h-full gap-2 py-12">
        <Empty.Header className="gap-2">
          <Empty.Media className="mb-0">
            <SearchIcon size={20} aria-hidden="true" className="text-muted-foreground" />
          </Empty.Media>
          <Empty.Title className="text-foreground text-[15px] font-medium">
            {t('noResults')}
          </Empty.Title>
          <Empty.Description className="text-muted-foreground text-[13px]">
            {t('tryAnother')}
          </Empty.Description>
        </Empty.Header>
      </Empty>
    );
  }

  if (results.length > 0) {
    return (
      <div
        ref={containerRef}
        id={listboxId}
        role="listbox"
        aria-label={t('results')}
        className="hide-scrollbar min-h-0 overflow-y-auto"
      >
        <ul role="presentation" className="flex flex-col gap-0.5">
          {results.map((item, index) => (
            <ResultItem
              key={`${item.category}:${item.href}`}
              id={optionId(index)}
              href={item.href}
              title={item.title}
              isActive={index === selectedIndex}
              onPointerMove={() => onSelect(index)}
              meta={item.category}
              badge={item.badge}
            />
          ))}
        </ul>
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div
      ref={containerRef}
      id={listboxId}
      role="listbox"
      aria-label={t('results')}
      className="hide-scrollbar min-h-0 overflow-y-auto"
    >
      {navigation.map((section) => (
        <div key={section.id} role="group" aria-label={section.title}>
          <SectionHeader label={section.title} />
          <ul role="presentation" className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const index = globalIndex;
              const isActive = index === selectedIndex;
              globalIndex++;
              return (
                <ResultItem
                  key={item.href}
                  id={optionId(index)}
                  href={item.href}
                  title={item.title}
                  isActive={isActive}
                  onPointerMove={() => onSelect(index)}
                  badge={item.badge}
                />
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
