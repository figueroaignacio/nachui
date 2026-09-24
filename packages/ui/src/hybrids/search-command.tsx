'use client';

import * as React from 'react';
import { Dialog } from '../components/dialog';
import { Kbd, KbdGroup } from '../components/kbd';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function SearchIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CornerDownLeftIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
      <path d="m9 10-5 5 5 5" />
    </svg>
  );
}

interface SearchItem {
  id: string;
  label: string;
  group?: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

interface SearchCommandLabels {
  placeholder: string;
  empty: string;
  navigate: string;
  select: string;
  close: string;
  trigger: string;
}

const DEFAULT_LABELS: SearchCommandLabels = {
  placeholder: 'Search…',
  empty: 'No results.',
  navigate: 'navigate',
  select: 'select',
  close: 'close',
  trigger: 'Search',
};

const isMac = () => typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform);

const defaultFilter = (item: SearchItem, query: string): boolean => {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [item.label, item.description, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
};

interface SearchCommandContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  items: SearchItem[];
  results: SearchItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  select: (item: SearchItem) => void;
  labels: SearchCommandLabels;
  hotkey: string;
  modifier: string;
  id: string;
}

const SearchCommandContext = React.createContext<SearchCommandContextValue | null>(null);

const useSearchCommand = (): SearchCommandContextValue => {
  const context = React.use(SearchCommandContext);
  if (!context) {
    throw new Error('SearchCommand components must be used within SearchCommand');
  }
  return context;
};

interface SearchCommandProps {
  items: SearchItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hotkey?: string | null;
  placeholder?: string;
  emptyText?: string;
  filter?: (item: SearchItem, query: string) => boolean;
  onSelect?: (item: SearchItem) => void;
  closeOnSelect?: boolean;
  labels?: Partial<SearchCommandLabels>;
  className?: string;
  children?: React.ReactNode;
}

const SearchCommandRoot = ({
  items,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  hotkey = 'k',
  placeholder,
  emptyText,
  filter = defaultFilter,
  onSelect,
  closeOnSelect = true,
  labels: labelOverrides,
  className,
  children,
}: SearchCommandProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [query, setQueryState] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [modifier, setModifier] = React.useState('Ctrl');
  const id = React.useId();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) {
        setQueryState('');
        setActiveIndex(0);
      }
    },
    [isControlled, onOpenChange],
  );

  const setQuery = React.useCallback((next: string) => {
    setQueryState(next);
    setActiveIndex(0);
  }, []);

  React.useEffect(() => {
    if (isMac()) setModifier('⌘');
  }, []);

  React.useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() !== hotkey.toLowerCase()) return;
      event.preventDefault();
      setOpen(!open);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotkey, open, setOpen]);

  const results = React.useMemo(
    () => items.filter((item) => filter(item, query)),
    [items, filter, query],
  );

  const select = React.useCallback(
    (item: SearchItem) => {
      if (item.disabled) return;
      item.onSelect?.();
      onSelect?.(item);
      if (closeOnSelect) setOpen(false);
    },
    [closeOnSelect, onSelect, setOpen],
  );

  const labels = React.useMemo<SearchCommandLabels>(
    () => ({
      ...DEFAULT_LABELS,
      ...(placeholder ? { placeholder } : {}),
      ...(emptyText ? { empty: emptyText } : {}),
      ...labelOverrides,
    }),
    [placeholder, emptyText, labelOverrides],
  );

  const value = React.useMemo<SearchCommandContextValue>(
    () => ({
      open,
      setOpen,
      query,
      setQuery,
      items,
      results,
      activeIndex,
      setActiveIndex,
      select,
      labels,
      hotkey: hotkey ?? '',
      modifier,
      id,
    }),
    [
      open,
      setOpen,
      query,
      setQuery,
      items,
      results,
      activeIndex,
      select,
      labels,
      hotkey,
      modifier,
      id,
    ],
  );

  return (
    <SearchCommandContext value={value}>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className={cn('contents', className)}>
          {children ?? (
            <>
              <SearchCommandTrigger />
              <SearchCommandDialog />
            </>
          )}
        </div>
      </Dialog>
    </SearchCommandContext>
  );
};

SearchCommandRoot.displayName = 'SearchCommand';

type SearchCommandTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const SearchCommandTrigger = ({
  className,
  children,
  ref,
  ...props
}: SearchCommandTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { labels, hotkey, modifier } = useSearchCommand();

  return (
    <Dialog.Trigger
      ref={ref}
      aria-label={labels.trigger}
      className={cn(
        'border-border bg-background text-muted-foreground hover:border-border-interactive hover:text-foreground focus-visible:ring-ring inline-flex h-9 w-full max-w-sm items-center gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <SearchIcon size={16} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate text-left">{children ?? labels.placeholder}</span>
      {hotkey ? (
        <KbdGroup aria-hidden="true">
          <Kbd size="sm">{modifier}</Kbd>
          <Kbd size="sm">{hotkey.toUpperCase()}</Kbd>
        </KbdGroup>
      ) : null}
    </Dialog.Trigger>
  );
};

SearchCommandTrigger.displayName = 'SearchCommandTrigger';

type SearchCommandDialogProps = React.ComponentProps<typeof Dialog.Content>;

const SearchCommandDialog = ({ className, children, ref, ...props }: SearchCommandDialogProps) => {
  const { labels } = useSearchCommand();

  return (
    <Dialog.Content
      ref={ref}
      aria-label={labels.trigger}
      className={cn(
        'top-[18%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0 [&>button:last-child]:hidden',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <SearchCommandInput />
          <SearchCommandList />
          <SearchCommandFooter />
        </>
      )}
    </Dialog.Content>
  );
};

SearchCommandDialog.displayName = 'SearchCommandDialog';

type SearchCommandInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
>;

const SearchCommandInput = ({
  className,
  onKeyDown,
  ref,
  ...props
}: SearchCommandInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const { query, setQuery, results, activeIndex, setActiveIndex, select, labels, id } =
    useSearchCommand();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (results.length) setActiveIndex((activeIndex + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (results.length) setActiveIndex((activeIndex - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) select(item);
    }
  };

  return (
    <div className="border-border flex items-center gap-2 border-b px-3">
      <SearchIcon size={16} className="text-muted-foreground shrink-0" />
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls={`${id}-list`}
        aria-activedescendant={
          results[activeIndex] ? `${id}-${results[activeIndex].id}` : undefined
        }
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        placeholder={labels.placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          'text-foreground placeholder:text-muted-foreground h-12 w-full bg-transparent text-sm outline-none',
          className,
        )}
        {...props}
      />
    </div>
  );
};

SearchCommandInput.displayName = 'SearchCommandInput';

type SearchCommandListProps = React.HTMLAttributes<HTMLDivElement>;

const SearchCommandList = ({
  className,
  ref,
  ...props
}: SearchCommandListProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { results, id, labels } = useSearchCommand();

  const groups = React.useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, SearchItem[]>();
    for (const item of results) {
      const key = item.group ?? '';
      if (!byGroup.has(key)) {
        byGroup.set(key, []);
        order.push(key);
      }
      byGroup.get(key)?.push(item);
    }
    return order.map((key) => ({ title: key, items: byGroup.get(key) ?? [] }));
  }, [results]);

  return (
    <div
      ref={ref}
      id={`${id}-list`}
      role="listbox"
      aria-label={labels.trigger}
      className={cn('max-h-80 overflow-y-auto p-2', className)}
      {...props}
    >
      {results.length === 0 ? (
        <SearchCommandEmpty />
      ) : (
        groups.map((group) => (
          <div key={group.title || 'ungrouped'} role="group" aria-label={group.title || undefined}>
            {group.title ? (
              <p className="text-muted-foreground px-2 pt-2 pb-1 font-mono text-[10px] tracking-[0.2em] uppercase">
                {group.title}
              </p>
            ) : null}
            {group.items.map((item) => (
              <SearchCommandItem key={item.id} item={item} />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

SearchCommandList.displayName = 'SearchCommandList';

interface SearchCommandItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  item: SearchItem;
}

const SearchCommandItem = ({
  item,
  className,
  ref,
  ...props
}: SearchCommandItemProps & { ref?: React.Ref<HTMLElement> }) => {
  const { results, activeIndex, setActiveIndex, select, id } = useSearchCommand();
  const index = results.indexOf(item);
  const active = index === activeIndex;
  const asLink = Boolean(item.href) && !item.onSelect;

  const shared = {
    id: `${id}-${item.id}`,
    role: 'option',
    'aria-selected': active,
    'aria-disabled': item.disabled || undefined,
    'data-active': active ? '' : undefined,
    'data-disabled': item.disabled ? '' : undefined,
    onMouseMove: () => {
      if (!item.disabled && index !== activeIndex) setActiveIndex(index);
    },
    onClick: (event: React.MouseEvent) => {
      if (item.disabled) {
        event.preventDefault();
        return;
      }
      if (asLink) {
        select(item);
        return;
      }
      event.preventDefault();
      select(item);
    },
    className: cn(
      'text-foreground data-[active]:bg-secondary flex w-full cursor-default items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      className,
    ),
  };

  const content = (
    <>
      {item.icon ? (
        <span className="text-muted-foreground flex shrink-0 [&>svg]:size-4">{item.icon}</span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{item.label}</span>
        {item.description ? (
          <span className="text-muted-foreground truncate text-xs">{item.description}</span>
        ) : null}
      </span>
      {item.shortcut?.length ? (
        <KbdGroup aria-hidden="true" className="shrink-0">
          {item.shortcut.map((key) => (
            <Kbd key={key} size="sm">
              {key}
            </Kbd>
          ))}
        </KbdGroup>
      ) : null}
    </>
  );

  if (asLink) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={item.href}
        {...shared}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} {...shared} {...props}>
      {content}
    </div>
  );
};

SearchCommandItem.displayName = 'SearchCommandItem';

type SearchCommandEmptyProps = React.HTMLAttributes<HTMLParagraphElement>;

const SearchCommandEmpty = ({
  className,
  children,
  ref,
  ...props
}: SearchCommandEmptyProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const { labels } = useSearchCommand();

  return (
    <p
      ref={ref}
      role="status"
      className={cn('text-muted-foreground px-2 py-8 text-center text-sm', className)}
      {...props}
    >
      {children ?? labels.empty}
    </p>
  );
};

SearchCommandEmpty.displayName = 'SearchCommandEmpty';

type SearchCommandFooterProps = React.HTMLAttributes<HTMLDivElement>;

const SearchCommandFooter = ({
  className,
  children,
  ref,
  ...props
}: SearchCommandFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { labels } = useSearchCommand();

  return (
    <div
      ref={ref}
      className={cn(
        'border-border text-muted-foreground flex items-center gap-4 border-t px-3 py-2 text-xs',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="flex items-center gap-1.5">
            <KbdGroup aria-hidden="true">
              <Kbd size="sm">↑</Kbd>
              <Kbd size="sm">↓</Kbd>
            </KbdGroup>
            {labels.navigate}
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd size="sm" aria-hidden="true">
              <CornerDownLeftIcon size={10} />
            </Kbd>
            {labels.select}
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd size="sm" aria-hidden="true">
              esc
            </Kbd>
            {labels.close}
          </span>
        </>
      )}
    </div>
  );
};

SearchCommandFooter.displayName = 'SearchCommandFooter';

const SearchCommand = Object.assign(SearchCommandRoot, {
  Trigger: SearchCommandTrigger,
  Dialog: SearchCommandDialog,
  Input: SearchCommandInput,
  List: SearchCommandList,
  Item: SearchCommandItem,
  Empty: SearchCommandEmpty,
  Footer: SearchCommandFooter,
});

export { SearchCommand, useSearchCommand };
export type {
  SearchCommandDialogProps,
  SearchCommandEmptyProps,
  SearchCommandFooterProps,
  SearchCommandInputProps,
  SearchCommandItemProps,
  SearchCommandLabels,
  SearchCommandListProps,
  SearchCommandProps,
  SearchCommandTriggerProps,
  SearchItem,
};
