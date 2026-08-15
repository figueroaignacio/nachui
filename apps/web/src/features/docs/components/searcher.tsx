'use client';

import { useSearch } from '@/features/docs/hooks/use-search';
import { useDialogFocus } from '@/hooks/use-dialog-focus';
import { useKbdShortcut } from '@/hooks/use-kbd-shortcut';
import { useRouter } from '@/i18n/navigation';
import {
  ArrowDown01Icon,
  ArrowMoveDownLeftIcon,
  ArrowUp01Icon,
  Search02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Dialog } from '@repo/ui/components/dialog';
import { Kbd } from '@repo/ui/components/kbd';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

export function Searcher({ variant = 'default' }: { variant?: 'default' | 'icon' }) {
  const t = useTranslations('components.searcher');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {
    query,
    setQuery,
    clearQuery,
    results,
    navigation,
    selectedIndex,
    nextItem,
    previousItem,
    activeItems,
  } = useSearch();
  const { inputRef, handleOpenChange } = useDialogFocus();

  useKbdShortcut(['cmd', 'k'], () => setIsOpen((prev) => !prev));

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        previousItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = activeItems[selectedIndex];
        if (activeItem) {
          router.push(activeItem.href);
          setIsOpen(false);
          clearQuery();
        }
      }
    },
    [nextItem, previousItem, activeItems, selectedIndex, router, clearQuery],
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        handleOpenChange(open, clearQuery);
      }}
    >
      <Dialog.Trigger asChild>
        {variant === 'icon' ? (
          <button
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 items-center justify-center rounded-md transition-colors"
            title={t('label')}
            aria-label={t('label')}
          >
            <HugeiconsIcon icon={Search02Icon} size={15} aria-hidden="true" />
          </button>
        ) : (
          <button
            className="group border-border/40 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:border-border/60 hover:text-foreground/80 flex h-8 w-full items-center gap-2.5 rounded-sm border px-3 text-xs transition-all duration-150 sm:w-48"
            title={t('label')}
            aria-label={t('label')}
          >
            <HugeiconsIcon
              icon={Search02Icon}
              size={13}
              className="shrink-0 opacity-60 transition-opacity group-hover:opacity-80"
              aria-hidden="true"
            />
            <span className="flex-1 text-left">{t('placeholder')}</span>
            <div className="hidden items-center gap-0.5 sm:flex">
              <Kbd size="sm">ctrl</Kbd>
              <span className="text-muted-foreground/50 text-[9px]">+</span>
              <Kbd size="sm">K</Kbd>
            </div>
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Content className="border-border/60 max-w-lg overflow-hidden border p-0 shadow-2xl">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={clearQuery}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          placeholder={t('placeholder')}
        />
        <SearchResults
          query={query}
          results={results}
          navigation={navigation}
          selectedIndex={selectedIndex}
        />
        <div className="border-border/30 flex items-center justify-between border-t px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Kbd size="sm" variant="outline">
                <HugeiconsIcon icon={ArrowDown01Icon} size={9} aria-hidden="true" />
              </Kbd>
              <Kbd size="sm" variant="outline">
                <HugeiconsIcon icon={ArrowUp01Icon} size={9} aria-hidden="true" />
              </Kbd>
              <span className="text-muted-foreground/50 text-[10px]">navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Kbd size="sm" variant="outline">
                <HugeiconsIcon icon={ArrowMoveDownLeftIcon} size={9} aria-hidden="true" />
              </Kbd>
              <span className="text-muted-foreground/50 text-[10px]">{t('select')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd size="sm" variant="outline" className="text-[9px]">
              esc
            </Kbd>
            <span className="text-muted-foreground/50 text-[10px]">{t('exit')}</span>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
