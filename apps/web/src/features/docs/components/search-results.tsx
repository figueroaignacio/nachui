import { NavBadge } from '@/components/common/nav-badge';
import { AiAvatar } from '@/features/chat/ui/ai-avatar';
import { Link } from '@/i18n/navigation';
import type { DocBadge, NavigationSection, SearchResultItem } from '@/lib/definitions';
import { Dialog } from '@repo/ui/components/dialog';
import { Empty } from '@repo/ui/components/empty';
import { Separator } from '@repo/ui/components/separator';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  navigation: NavigationSection[];
  selectedIndex: number;
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
}: {
  id: string;
  href: string;
  title: string;
  isActive: boolean;
  meta?: string;
  badge?: DocBadge;
}) {
  return (
    <li id={id} role="option" aria-selected={isActive}>
      <Dialog.Close className="h-full w-full text-left outline-none">
        <Link
          href={href}
          data-active={isActive}
          className={cn(
            'group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-100',
            isActive
              ? 'bg-secondary text-foreground'
              : 'text-foreground/70 hover:bg-secondary/50 hover:text-foreground',
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                isActive
                  ? 'bg-foreground'
                  : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/60',
              )}
            />
            <span className={cn('truncate', isActive && 'font-medium')}>{title}</span>
            <NavBadge badge={badge} />
          </div>
          {meta && (
            <span className="text-muted-foreground/40 shrink-0 text-[10px] font-medium tracking-wide uppercase">
              {meta}
            </span>
          )}
        </Link>
      </Dialog.Close>
    </li>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <Separator
      label={label}
      className="[&>span:last-child]:bg-border/30 [&>span:nth-child(2)]:text-muted-foreground/40 px-3 pt-3 pb-1 first:pt-0 [&>span:first-child]:hidden [&>span:nth-child(2)]:text-[10px] [&>span:nth-child(2)]:font-semibold [&>span:nth-child(2)]:tracking-widest [&>span:nth-child(2)]:uppercase"
    />
  );
}

export function SearchResults({
  query,
  results,
  navigation,
  selectedIndex,
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
      <Empty className="gap-2 py-12">
        <Empty.Header className="gap-2">
          <Empty.Media className="mb-0">
            <AiAvatar size="lg" />
          </Empty.Media>
          <Empty.Title className="text-muted-foreground/60 text-sm font-normal">
            {t('noResults')}
          </Empty.Title>
          <Empty.Description className="text-muted-foreground/35 text-xs">
            Try a different keyword
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
        className="max-h-[320px] overflow-y-auto px-2 pb-2"
      >
        <SectionHeader label="Results" />
        <ul role="presentation" className="space-y-0.5">
          {results.map((item, index) => (
            <ResultItem
              key={item.href}
              id={optionId(index)}
              href={item.href}
              title={item.title}
              isActive={index === selectedIndex}
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
      className="max-h-[320px] overflow-y-auto px-2 pb-2"
    >
      {navigation.map((section) => (
        <div key={section.title} role="group" aria-label={section.title}>
          <SectionHeader label={section.title} />
          <ul role="presentation" className="space-y-0.5">
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
