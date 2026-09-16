'use client';

import { useSearch } from '@/features/docs/hooks/use-search';
import { useDialogFocus } from '@/hooks/use-dialog-focus';
import { useKbdShortcut } from '@/hooks/use-kbd-shortcut';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@repo/ui/components/button';
import { Dock } from '@repo/ui/components/dock';
import { Dialog } from '@repo/ui/components/dialog';
import { Kbd } from '@repo/ui/components/kbd';
import { ChevronDownIcon } from '@repo/ui/icons/chevron-down';
import { ChevronUpIcon } from '@repo/ui/icons/chevron-up';
import { CornerDownLeftIcon } from '@repo/ui/icons/corner-down-left';
import { SearchIcon } from '@repo/ui/icons/search';
import { useTranslations } from 'next-intl';
import { useCallback, useId, useState } from 'react';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

export function Searcher({ variant = 'default' }: { variant?: 'default' | 'icon' | 'dock' }) {
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

  const listboxId = useId();
  const optionId = useCallback((index: number) => `${listboxId}-option-${index}`, [listboxId]);
  const hasOptions = activeItems.length > 0;

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
        {variant === 'dock' ? (
          <Dock.Item label={t('label')}>
            <SearchIcon aria-hidden="true" />
          </Dock.Item>
        ) : variant === 'icon' ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground size-8"
            title={t('label')}
            aria-label={t('label')}
          >
            <SearchIcon size={15} aria-hidden="true" />
          </Button>
        ) : (
          <button
            className="group border-border/40 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:border-border/60 hover:text-foreground/80 flex h-8 w-full items-center gap-2.5 rounded-sm border px-3 text-xs transition-all duration-150 sm:w-48"
            title={t('label')}
            aria-label={t('label')}
          >
            <SearchIcon
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
          label={t('label')}
          clearLabel={t('clear')}
          listboxId={listboxId}
          expanded={hasOptions}
          activeOptionId={hasOptions ? optionId(selectedIndex) : undefined}
        />
        <SearchResults
          query={query}
          results={results}
          navigation={navigation}
          selectedIndex={selectedIndex}
          listboxId={listboxId}
          optionId={optionId}
        />
        <div className="border-border/30 flex items-center justify-between border-t px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Kbd size="sm" variant="outline">
                <ChevronDownIcon size={9} aria-hidden="true" />
              </Kbd>
              <Kbd size="sm" variant="outline">
                <ChevronUpIcon size={9} aria-hidden="true" />
              </Kbd>
              <span className="text-muted-foreground/50 text-[10px]">navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Kbd size="sm" variant="outline">
                <CornerDownLeftIcon size={9} aria-hidden="true" />
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
