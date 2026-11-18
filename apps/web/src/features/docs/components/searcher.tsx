'use client';

import { useSearch } from '@/features/docs/hooks/use-search';
import { useDialogFocus } from '@/hooks/use-dialog-focus';
import { useKbdShortcut } from '@/hooks/use-kbd-shortcut';
import { useRouter } from '@/i18n/navigation';
import { Dialog } from '@repo/ui/components/dialog';
import { Kbd } from '@repo/ui/components/kbd';
import { ChevronDownIcon } from '@repo/ui/icons/chevron-down';
import { ChevronUpIcon } from '@repo/ui/icons/chevron-up';
import { CornerDownLeftIcon } from '@repo/ui/icons/corner-down-left';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useId } from 'react';
import type { SidebarPreview } from '../lib/sidebar-previews';
import { SearchInput } from './search-input';
import { SearchPreview } from './search-preview';
import { SearchResults } from './search-results';

const EMPTY: Record<string, SidebarPreview> = {};

type SearcherProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The first demo of every doc page, keyed by its nav href. */
  previews?: Record<string, SidebarPreview>;
};

/**
 * The search dialog: results on one side, the selected page on the other. It
 * renders no trigger of its own: the header owns the
 * open state so several buttons can open the same dialog and the shortcut is
 * bound once.
 */
export function Searcher({ open: isOpen, onOpenChange, previews = EMPTY }: SearcherProps) {
  const t = useTranslations('components.searcher');
  const router = useRouter();
  const {
    query,
    setQuery,
    clearQuery,
    results,
    navigation,
    selectedIndex,
    setSelectedIndex,
    nextItem,
    previousItem,
    activeItems,
  } = useSearch();
  const { inputRef, handleOpenChange } = useDialogFocus();

  const listboxId = useId();
  const optionId = useCallback((index: number) => `${listboxId}-option-${index}`, [listboxId]);
  const hasOptions = activeItems.length > 0;

  useKbdShortcut(['mod', 'k'], () => onOpenChange(!isOpen), { allowInEditable: true });

  useEffect(() => {
    handleOpenChange(isOpen, clearQuery);
  }, [isOpen, handleOpenChange, clearQuery]);

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
          onOpenChange(false);
        }
      }
    },
    [nextItem, previousItem, activeItems, selectedIndex, router, onOpenChange],
  );

  const activeItem = activeItems[selectedIndex];
  const activeCategory =
    activeItem && 'category' in activeItem ? (activeItem.category as string) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content
        showClose={false}
        className="bg-card flex h-[min(34rem,calc(100dvh-2rem))] max-w-[52rem] flex-col gap-2.5 overflow-hidden rounded-xl border-0 p-2.5 shadow-lg"
      >
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
          count={query ? results.length : undefined}
        />
        <div className="grid min-h-0 flex-1 gap-2.5 md:grid-cols-2">
          <SearchResults
            query={query}
            results={results}
            navigation={navigation}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            listboxId={listboxId}
            optionId={optionId}
          />
          <SearchPreview
            item={activeItem}
            category={activeCategory}
            preview={activeItem ? previews[activeItem.href] : undefined}
          />
        </div>
        <div className="text-muted-foreground hidden items-center gap-4 px-2.5 pb-0.5 text-[13px] md:flex">
          <span className="flex items-center gap-1.5">
            <Kbd size="sm">
              <ChevronUpIcon size={10} aria-hidden="true" />
            </Kbd>
            <Kbd size="sm">
              <ChevronDownIcon size={10} aria-hidden="true" />
            </Kbd>
            {t('navigate')}
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd size="sm">
              <CornerDownLeftIcon size={10} aria-hidden="true" />
            </Kbd>
            {t('select')}
          </span>
          <span className="ms-auto flex items-center gap-1.5">
            <Kbd size="sm">esc</Kbd>
            {t('exit')}
          </span>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
