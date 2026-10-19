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
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

type SearcherProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * The search dialog. It renders no trigger of its own: the header owns the
 * open state so several buttons can open the same dialog and the shortcut is
 * bound once.
 */
export function Searcher({ open: isOpen, onOpenChange }: SearcherProps) {
  const t = useTranslations('components.searcher');
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
