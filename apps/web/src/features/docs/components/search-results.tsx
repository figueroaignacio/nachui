import { AiAvatar } from '@/features/chat/ui/ai-avatar';
import { Link } from '@/i18n/navigation';
import type { NavigationSection, SearchResultItem } from '@/lib/definitions';
import { Dialog } from '@repo/ui/components/dialog';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  navigation: NavigationSection[];
  selectedIndex: number;
}

function ResultItem({
  href,
  title,
  isActive,
  meta,
}: {
  href: string;
  title: string;
  isActive: boolean;
  meta?: string;
}) {
  return (
    <li>
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
    <div className="flex items-center gap-2 px-3 pt-3 pb-1 first:pt-0">
      <span className="text-muted-foreground/40 text-[10px] font-semibold tracking-widest uppercase">
        {label}
      </span>
      <span className="border-border/30 flex-1 border-t" />
    </div>
  );
}

export function SearchResults({ query, results, navigation, selectedIndex }: SearchResultsProps) {
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
      <div className="flex flex-col items-center gap-2 py-12">
        <AiAvatar size="lg" />
        <p className="text-muted-foreground/60 text-sm">{t('noResults')}</p>
        <p className="text-muted-foreground/35 text-xs">Try a different keyword</p>
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div ref={containerRef} className="max-h-[320px] overflow-y-auto px-2 pb-2">
        <SectionHeader label="Results" />
        <ul className="space-y-0.5">
          {results.map((item, index) => (
            <ResultItem
              key={item.href}
              href={item.href}
              title={item.title}
              isActive={index === selectedIndex}
              meta={item.category}
            />
          ))}
        </ul>
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div ref={containerRef} className="max-h-[320px] overflow-y-auto px-2 pb-2">
      {navigation.map((section) => (
        <div key={section.title}>
          <SectionHeader label={section.title} />
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = globalIndex === selectedIndex;
              globalIndex++;
              return (
                <ResultItem
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  isActive={isActive}
                />
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
