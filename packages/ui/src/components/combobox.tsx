'use client';

import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { getNavigationIndex } from '../lib/collection';
import { FloatingPortal, useFloating } from '../lib/floating';
import { FormValue, useFormReset } from '../lib/form-control';
import { floatingOrigin, springs, still } from '../lib/motion';
import { useLayer } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function Icon({ size = 24, strokeWidth = 1.5, children, ...props }: IconProps) {
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
      {children}
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </Icon>
  );
}

function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  );
}

function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

function LoaderIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21.5 12A9.5 9.5 0 1 1 12 2.5" />
    </Icon>
  );
}

type ComboboxFilter = (itemText: string, query: string) => boolean;

type ComboboxCreateHandler = (query: string) => string | void;

interface ComboboxBaseProps {
  children: React.ReactNode;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  filter?: ComboboxFilter | false;
  openOnFocus?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  resultsLabel?: (count: number) => string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  form?: string;
  className?: string;
}

interface ComboboxSingleProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface ComboboxMultipleProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

type ComboboxProps = ComboboxBaseProps & (ComboboxSingleProps | ComboboxMultipleProps);

interface ComboboxInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'children' | 'size' | 'type'
> {
  children?: React.ReactNode;
  removeLabel?: (label: string) => string;
}

interface ComboboxContentProps {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
}

interface ComboboxItemProps {
  value: string;
  children: React.ReactNode;
  textValue?: string;
  disabled?: boolean;
  className?: string;
}

interface ComboboxGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface ComboboxLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface ComboboxSeparatorProps {
  className?: string;
}

interface ComboboxEmptyProps {
  children: React.ReactNode;
  className?: string;
}

interface ComboboxCreateProps {
  onCreate: ComboboxCreateHandler;
  children?: React.ReactNode | ((query: string) => React.ReactNode);
  className?: string;
}

interface ComboboxClearProps {
  label?: string;
  className?: string;
}

interface Registry {
  items: ReadonlyMap<string, string>;
  seen: ReadonlyMap<string, string>;
}

interface ComboboxContextValue {
  multiple: boolean;
  disabled: boolean;
  openOnFocus: boolean;
  selectedValues: readonly string[];
  inputValue: string;
  query: string;
  expanded: boolean;
  loading: boolean;
  loadingLabel: string;
  registry: Registry;
  matches: (label: string) => boolean;
  createVisible: boolean;
  emptyVisible: boolean;
  highlightedKey: string | null;
  activeDescendant: string | undefined;
  canClear: boolean;
  inputId: string;
  listId: string;
  createId: string;
  optionId: (value: string) => string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  fieldRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  layer: ReturnType<typeof useLayer>;
  setOpen: (open: boolean) => void;
  closeList: () => void;
  setActiveKey: (key: string | null) => void;
  activate: (key: string) => void;
  removeValue: (value: string) => void;
  clear: () => void;
  registerItem: (value: string, label: string) => () => void;
  registerCreate: (handler: ComboboxCreateHandler) => () => void;
  registerEmpty: () => () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onInputClick: () => void;
}

interface ComboboxGroupContextValue {
  labelId: string;
  registerLabel: () => () => void;
  registerValue: (value: string) => () => void;
}

const CREATE_KEY = '\u0000create';

const EMPTY: string[] = [];

const ICON_VARIANTS = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
} as const;

const ICON_TRANSITION = springs.snappy;
const ICON_STYLE = { willChange: 'transform' } as const;
const CONTENT_STYLE = { willChange: 'opacity, transform' } as const;

const CONTENT_OPEN = {
  opacity: 1,
  scale: 1,
  y: 0,
  visibility: 'visible' as const,
  transition: { ...springs.smooth, opacity: { duration: 0.15 } },
};

const CONTENT_CLOSED = {
  bottom: {
    opacity: 0,
    scale: 0.97,
    y: -4,
    transition: { duration: 0.15 },
    transitionEnd: { visibility: 'hidden' as const },
  },
  top: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: 0.15 },
    transitionEnd: { visibility: 'hidden' as const },
  },
} as const;

const ITEM_CLASS =
  'relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 ps-2 text-sm outline-none select-none transition-colors duration-150 data-highlighted:bg-muted';

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

const ComboboxGroupContext = React.createContext<ComboboxGroupContextValue | null>(null);

const ComboboxSlotContext = React.createContext<HTMLElement | null>(null);

const useComboboxContext = (): ComboboxContextValue => {
  const context = React.use(ComboboxContext);
  if (!context) throw new Error('Combobox components must be used within Combobox');
  return context;
};

function normalizeText(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function defaultFilter(itemText: string, query: string) {
  return normalizeText(itemText).includes(normalizeText(query));
}

function defaultResultsLabel(count: number) {
  if (count === 0) return 'No results';
  return count === 1 ? '1 result available' : `${count} results available`;
}

function defaultRemoveLabel(label: string) {
  return `Remove ${label}`;
}

function matchRange(text: string, query: string): [number, number] | null {
  const needle = normalizeText(query);
  if (!needle) return null;
  let folded = '';
  const starts: number[] = [];
  const ends: number[] = [];
  let index = 0;
  for (const char of text) {
    const piece = normalizeText(char);
    for (let step = 0; step < piece.length; step += 1) {
      starts.push(index);
      ends.push(index + char.length);
    }
    folded += piece;
    index += char.length;
  }
  const at = folded.indexOf(needle);
  if (at === -1) return null;
  const start = starts[at];
  const end = ends[at + needle.length - 1];
  if (start === undefined || end === undefined) return null;
  return [start, end];
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const range = matchRange(text, query);
  if (!range) return text;
  const [start, end] = range;
  return (
    <>
      {text.slice(0, start)}
      <mark data-slot="combobox-item-match" className="bg-transparent font-semibold text-current">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}

function getOptions(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>('[role="option"]')).filter(
    (option) => option.getAttribute('aria-disabled') !== 'true' && !option.closest('[hidden]'),
  );
}

function keyOf(option: HTMLElement): string | null {
  if (option.dataset.create !== undefined) return CREATE_KEY;
  return option.dataset.value ?? null;
}

function toList(value: string | string[]): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : EMPTY;
}

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  anchorRef: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean,
  isInsideUpperLayer: (target: EventTarget | null) => boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        ref.current?.contains(event.target as Node) ||
        anchorRef.current?.contains(event.target as Node) ||
        isInsideUpperLayer(event.target)
      ) {
        return;
      }
      handler();
    };
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [ref, anchorRef, handler, enabled, isInsideUpperLayer]);
}

const ComboboxRoot = (props: ComboboxProps): React.JSX.Element => {
  const {
    children,
    inputValue: controlledInputValue,
    defaultInputValue,
    onInputValueChange,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    filter,
    openOnFocus = true,
    loading = false,
    loadingLabel = 'Searching...',
    resultsLabel = defaultResultsLabel,
    disabled = false,
    name,
    required,
    form,
    className,
  } = props;
  const multiple = props.multiple === true;
  const onValueChange = props.onValueChange as ((value: string | string[]) => void) | undefined;
  const [resetValue] = React.useState<string | string[]>(
    () => props.defaultValue ?? (multiple ? EMPTY : ''),
  );

  const [value, setValue] = useControllableState<string | string[]>({
    value: props.value,
    defaultValue: resetValue,
    onChange: onValueChange,
  });
  const [inputValue, setInputValue] = useControllableState({
    value: controlledInputValue,
    defaultValue: defaultInputValue ?? '',
    onChange: onInputValueChange,
  });
  const [open, setOpenState] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [registry, setRegistry] = React.useState<Registry>(() => ({
    items: new Map(),
    seen: new Map(),
  }));
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const [createCount, setCreateCount] = React.useState(0);
  const [emptyCount, setEmptyCount] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState('');
  const [trackedOpen, setTrackedOpen] = React.useState(open);

  if (trackedOpen !== open) {
    setTrackedOpen(open);
    if (!open) setActiveKey(null);
  }

  const createRef = React.useRef<ComboboxCreateHandler | null>(null);
  const dirtyRef = React.useRef(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const id = React.useId();
  const inputId = `combobox-input-${id}`;
  const listId = `combobox-list-${id}`;
  const createId = `${listId}-create`;

  const selectedValues = React.useMemo(() => toList(value), [value]);
  const singleValue = typeof value === 'string' ? value : '';
  const selectedLabel = !multiple && singleValue ? registry.seen.get(singleValue) : undefined;
  const query =
    !multiple && selectedLabel !== undefined && inputValue === selectedLabel ? '' : inputValue;
  const trimmed = query.trim();
  const filterFn = filter === false ? null : (filter ?? defaultFilter);

  const matches = React.useCallback(
    (label: string) => !filterFn || trimmed === '' || filterFn(label, trimmed),
    [filterFn, trimmed],
  );

  const { visibleCount, exactMatch } = React.useMemo(() => {
    const needle = normalizeText(trimmed);
    let count = 0;
    let exact = false;
    for (const label of registry.items.values()) {
      if (matches(label)) count += 1;
      if (needle && normalizeText(label.trim()) === needle) exact = true;
    }
    return { visibleCount: count, exactMatch: exact };
  }, [registry.items, matches, trimmed]);

  const createVisible = createCount > 0 && trimmed !== '' && !exactMatch;
  const emptyVisible = visibleCount === 0 && !loading && !createVisible;
  const expanded =
    open &&
    !disabled &&
    (visibleCount > 0 || createVisible || loading || (emptyCount > 0 && emptyVisible));

  const layer = useLayer(expanded, false, listRef);

  const activeLabel =
    activeKey === null || activeKey === CREATE_KEY ? undefined : registry.items.get(activeKey);
  const activeValid =
    activeKey === CREATE_KEY ? createVisible : activeLabel !== undefined && matches(activeLabel);
  const highlightedKey = expanded && activeValid ? activeKey : null;

  const optionId = React.useCallback(
    (itemValue: string) => `${listId}-option-${encodeURIComponent(itemValue)}`,
    [listId],
  );

  const activeDescendant =
    highlightedKey === null
      ? undefined
      : highlightedKey === CREATE_KEY
        ? createId
        : optionId(highlightedKey);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (next && disabled) return;
      setOpenState(next);
    },
    [disabled, setOpenState],
  );

  const closeList = React.useCallback(() => setOpenState(false), [setOpenState]);

  const commitText = React.useCallback(
    (text: string) => {
      dirtyRef.current = false;
      setInputValue(text);
    },
    [setInputValue],
  );

  const commitValue = React.useCallback(
    (next: string, label: string | undefined, toggle: boolean) => {
      if (multiple) {
        setValue((previous) => {
          const list = toList(previous);
          if (list.includes(next)) return toggle ? list.filter((item) => item !== next) : list;
          return [...list, next];
        });
        commitText('');
        return;
      }
      setValue(next);
      commitText(label ?? registry.seen.get(next) ?? next);
      closeList();
    },
    [multiple, setValue, commitText, closeList, registry.seen],
  );

  const create = React.useCallback(() => {
    const handler = createRef.current;
    if (!handler || !trimmed) return;
    const created = handler(trimmed);
    setActiveKey(null);
    if (typeof created === 'string') {
      setRegistry((previous) => {
        if (previous.seen.has(created)) return previous;
        const seen = new Map(previous.seen);
        seen.set(created, trimmed);
        return { items: previous.items, seen };
      });
      commitValue(created, trimmed, false);
      return;
    }
    if (multiple) {
      commitText('');
      return;
    }
    commitText(trimmed);
    closeList();
  }, [trimmed, multiple, commitValue, commitText, closeList]);

  const activate = React.useCallback(
    (key: string) => {
      if (key === CREATE_KEY) create();
      else commitValue(key, undefined, true);
    },
    [create, commitValue],
  );

  const removeValue = React.useCallback(
    (item: string) => {
      setValue((previous) => {
        const list = toList(previous);
        return multiple ? list.filter((entry) => entry !== item) : '';
      });
    },
    [multiple, setValue],
  );

  const clear = React.useCallback(() => {
    setValue(multiple ? EMPTY : '');
    commitText('');
    setActiveKey(null);
  }, [multiple, setValue, commitText]);

  const registerItem = React.useCallback((itemValue: string, label: string) => {
    setRegistry((previous) => {
      if (previous.items.get(itemValue) === label && previous.seen.get(itemValue) === label) {
        return previous;
      }
      const items = new Map(previous.items);
      const seen = new Map(previous.seen);
      items.set(itemValue, label);
      seen.set(itemValue, label);
      return { items, seen };
    });
    return () => {
      setRegistry((previous) => {
        if (!previous.items.has(itemValue)) return previous;
        const items = new Map(previous.items);
        items.delete(itemValue);
        return { items, seen: previous.seen };
      });
    };
  }, []);

  const registerCreate = React.useCallback((handler: ComboboxCreateHandler) => {
    createRef.current = handler;
    setCreateCount((count) => count + 1);
    return () => {
      if (createRef.current === handler) createRef.current = null;
      setCreateCount((count) => count - 1);
    };
  }, []);

  const registerEmpty = React.useCallback(() => {
    setEmptyCount((count) => count + 1);
    return () => setEmptyCount((count) => count - 1);
  }, []);

  const highlightOption = React.useCallback((option: HTMLElement | undefined) => {
    if (!option) return;
    setActiveKey(keyOf(option));
    option.scrollIntoView?.({ block: 'nearest' });
  }, []);

  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dirtyRef.current = true;
      setInputValue(event.target.value);
      setActiveKey(null);
      if (!open) setOpen(true);
    },
    [setInputValue, open, setOpen],
  );

  const onInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing) return;
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          event.preventDefault();
          if (event.altKey) {
            setOpen(event.key === 'ArrowDown');
            return;
          }
          const options = getOptions(listRef.current);
          if (!expanded) setOpen(true);
          const current = expanded
            ? options.findIndex((option) => keyOf(option) === highlightedKey)
            : -1;
          const selected =
            current === -1 && !multiple && singleValue
              ? options.find((option) => option.dataset.value === singleValue)
              : undefined;
          if (selected) {
            highlightOption(selected);
            return;
          }
          const next = getNavigationIndex(event.key, current, options.length, {
            orientation: 'vertical',
            loop: true,
          });
          highlightOption(next === null ? undefined : options[next]);
          return;
        }
        case 'Enter': {
          if (!expanded) return;
          if (highlightedKey !== null) {
            event.preventDefault();
            activate(highlightedKey);
            return;
          }
          if (createVisible && visibleCount === 0) {
            event.preventDefault();
            create();
          }
          return;
        }
        case 'Escape': {
          if (expanded) {
            if (!layer.isTopmost()) return;
            event.preventDefault();
            closeList();
            return;
          }
          if (open) closeList();
          if (inputValue !== '' || (!multiple && singleValue !== '')) {
            event.preventDefault();
            clear();
          }
          return;
        }
        case 'Backspace': {
          const last = selectedValues[selectedValues.length - 1];
          if (multiple && inputValue === '' && last !== undefined) {
            event.preventDefault();
            removeValue(last);
          }
          return;
        }
        case 'Tab': {
          if (open) closeList();
          return;
        }
      }
    },
    [
      setOpen,
      expanded,
      multiple,
      singleValue,
      highlightOption,
      highlightedKey,
      activate,
      createVisible,
      visibleCount,
      create,
      layer,
      closeList,
      open,
      inputValue,
      clear,
      selectedValues,
      removeValue,
    ],
  );

  const onInputFocus = React.useCallback(() => {
    if (openOnFocus) setOpen(true);
  }, [openOnFocus, setOpen]);

  const onInputClick = React.useCallback(() => {
    if (openOnFocus && !open) setOpen(true);
  }, [openOnFocus, open, setOpen]);

  const onInputBlur = React.useCallback(() => {
    closeList();
    if (multiple) {
      if (inputValue !== '') commitText('');
      return;
    }
    if (!dirtyRef.current) return;
    if (inputValue.trim() === '' && singleValue !== '') {
      setValue('');
      commitText('');
      return;
    }
    commitText(selectedLabel ?? '');
  }, [closeList, multiple, inputValue, singleValue, setValue, commitText, selectedLabel]);

  const syncedLabelRef = React.useRef(selectedLabel);

  React.useLayoutEffect(() => {
    if (multiple || syncedLabelRef.current === selectedLabel) return;
    syncedLabelRef.current = selectedLabel;
    if (!dirtyRef.current) setInputValue(selectedLabel ?? '');
  }, [multiple, selectedLabel, setInputValue]);

  useFormReset(
    rootRef,
    () => {
      dirtyRef.current = false;
      setValue(resetValue);
      setOpenState(false);
      const label = typeof resetValue === 'string' ? registry.seen.get(resetValue) : undefined;
      setInputValue(label ?? defaultInputValue ?? '');
    },
    form,
  );

  const message = !expanded ? '' : loading ? loadingLabel : resultsLabel(visibleCount);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(message), message ? 500 : 0);
    return () => clearTimeout(timer);
  }, [message]);

  const canClear = inputValue !== '' || selectedValues.length > 0;

  const contextValue = React.useMemo<ComboboxContextValue>(
    () => ({
      multiple,
      disabled,
      openOnFocus,
      selectedValues,
      inputValue,
      query: trimmed,
      expanded,
      loading,
      loadingLabel,
      registry,
      matches,
      createVisible,
      emptyVisible,
      highlightedKey,
      activeDescendant,
      canClear,
      inputId,
      listId,
      createId,
      optionId,
      inputRef,
      fieldRef,
      listRef,
      layer,
      setOpen,
      closeList,
      setActiveKey,
      activate,
      removeValue,
      clear,
      registerItem,
      registerCreate,
      registerEmpty,
      onInputChange,
      onInputKeyDown,
      onInputFocus,
      onInputBlur,
      onInputClick,
    }),
    [
      multiple,
      disabled,
      openOnFocus,
      selectedValues,
      inputValue,
      trimmed,
      expanded,
      loading,
      loadingLabel,
      registry,
      matches,
      createVisible,
      emptyVisible,
      highlightedKey,
      activeDescendant,
      canClear,
      inputId,
      listId,
      createId,
      optionId,
      layer,
      setOpen,
      closeList,
      activate,
      removeValue,
      clear,
      registerItem,
      registerCreate,
      registerEmpty,
      onInputChange,
      onInputKeyDown,
      onInputFocus,
      onInputBlur,
      onInputClick,
    ],
  );

  return (
    <ComboboxContext value={contextValue}>
      <div ref={rootRef} data-slot="combobox" className={cn('relative w-full', className)}>
        {children}
        <FormValue
          name={name}
          value={multiple ? selectedValues : singleValue}
          required={required}
          disabled={disabled}
          form={form}
          onFocus={() => inputRef.current?.focus()}
        />
        <span data-slot="combobox-status" aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </span>
      </div>
    </ComboboxContext>
  );
};

const ComboboxInput = ({
  className,
  children,
  placeholder,
  removeLabel = defaultRemoveLabel,
  id,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  onClick,
  ref,
  ...props
}: ComboboxInputProps & { ref?: React.Ref<HTMLInputElement> }): React.JSX.Element => {
  const {
    multiple,
    disabled,
    openOnFocus,
    selectedValues,
    inputValue,
    expanded,
    registry,
    activeDescendant,
    inputId,
    listId,
    inputRef,
    fieldRef,
    setOpen,
    removeValue,
    onInputChange,
    onInputKeyDown,
    onInputFocus,
    onInputBlur,
    onInputClick,
  } = useComboboxContext();

  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  React.useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const handleMouseDown = (event: MouseEvent) => {
      const input = inputRef.current;
      const target = event.target as Element;
      if (!input || disabled || target === input || target.closest('button')) return;
      event.preventDefault();
      const toggle = target.closest('[data-slot="combobox-chevron"]') !== null;
      const wasFocused = document.activeElement === input;
      input.focus();
      if (toggle) setOpen(!(expanded && wasFocused));
      else if (openOnFocus) setOpen(true);
    };
    field.addEventListener('mousedown', handleMouseDown);
    return () => field.removeEventListener('mousedown', handleMouseDown);
  }, [fieldRef, inputRef, disabled, expanded, openOnFocus, setOpen]);

  const showPlaceholder = !multiple || selectedValues.length === 0;

  return (
    <div
      ref={fieldRef}
      data-slot="combobox-field"
      data-state={expanded ? 'open' : 'closed'}
      data-disabled={disabled || undefined}
      className={cn(
        'border-input text-foreground flex min-h-9 w-full cursor-text items-center gap-2 rounded-md border bg-transparent px-3 text-sm transition-[color,box-shadow]',
        'dark:bg-input/30 hover:border-border-interactive',
        'focus-within:border-foreground/40 focus-within:ring-foreground/10 focus-within:ring-[1px]',
        'has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/15 dark:has-[input[aria-invalid=true]]:ring-destructive/30',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-40',
        className,
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-wrap items-center gap-1 self-stretch',
          multiple && selectedValues.length > 0 && 'py-1',
        )}
      >
        {multiple &&
          selectedValues.map((item) => {
            const label = registry.seen.get(item) ?? item;
            return (
              <span
                key={item}
                data-slot="combobox-chip"
                className="bg-secondary border-border text-secondary-foreground inline-flex h-6 max-w-full items-center gap-1 rounded-full border ps-2 pe-1 text-xs"
              >
                <span className="truncate">{label}</span>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={removeLabel(label)}
                  data-slot="combobox-chip-remove"
                  disabled={disabled}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    removeValue(item);
                    inputRef.current?.focus();
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
                >
                  <XIcon size={12} className="size-3" />
                </button>
              </span>
            );
          })}
        <input
          {...props}
          ref={inputRef}
          id={id ?? inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={activeDescendant}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          data-slot="combobox-input"
          disabled={disabled}
          value={inputValue}
          placeholder={showPlaceholder ? placeholder : undefined}
          onChange={(event) => {
            onChange?.(event);
            if (!event.defaultPrevented) onInputChange(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) onInputKeyDown(event);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            if (!event.defaultPrevented) onInputFocus();
          }}
          onBlur={(event) => {
            onBlur?.(event);
            onInputBlur();
          }}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) onInputClick();
          }}
          className={cn(
            'placeholder:text-muted-foreground min-h-7 w-0 min-w-16 flex-1 self-stretch bg-transparent text-base outline-none disabled:cursor-not-allowed md:text-sm',
            multiple && selectedValues.length > 0 && 'min-h-6',
          )}
        />
      </div>
      {children}
      <motion.span
        aria-hidden="true"
        data-slot="combobox-chevron"
        variants={ICON_VARIANTS}
        animate={expanded ? 'open' : 'closed'}
        transition={ICON_TRANSITION}
        style={ICON_STYLE}
        className="text-muted-foreground flex shrink-0 cursor-pointer"
      >
        <ChevronDownIcon size={16} className="size-4" />
      </motion.span>
    </div>
  );
};

const ComboboxClear = ({
  label = 'Clear',
  className,
}: ComboboxClearProps): React.JSX.Element | null => {
  const { canClear, clear, disabled, inputRef } = useComboboxContext();
  if (!canClear) return null;
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      data-slot="combobox-clear"
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        clear();
        inputRef.current?.focus();
      }}
      className={cn(
        'text-muted-foreground hover:text-foreground hover:bg-muted flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors',
        className,
      )}
    >
      <XIcon size={14} className="size-3.5" />
    </button>
  );
};

type ListboxName = { 'aria-labelledby': string } | { 'aria-label': string };

function listboxNameFor(input: HTMLInputElement | null, fallbackId: string): ListboxName {
  if (!input) return { 'aria-labelledby': fallbackId };
  const labelledBy = input.getAttribute('aria-labelledby');
  if (labelledBy) return { 'aria-labelledby': labelledBy };
  const label = input.getAttribute('aria-label') ?? input.labels?.[0]?.textContent?.trim();
  if (label) return { 'aria-label': label };
  return { 'aria-labelledby': input.id || fallbackId };
}

const ComboboxContent = ({
  children,
  className,
  sideOffset = 4,
}: ComboboxContentProps): React.JSX.Element => {
  const {
    expanded,
    closeList,
    multiple,
    loading,
    loadingLabel,
    listId,
    inputId,
    inputRef,
    fieldRef,
    listRef,
    layer,
    setActiveKey,
    activate,
  } = useComboboxContext();
  const shouldReduceMotion = useReducedMotion();
  const [name, setName] = React.useState<ListboxName>({ 'aria-labelledby': inputId });
  const {
    style: floatingStyle,
    side,
    anchorHidden,
    anchorWidth,
  } = useFloating({
    open: expanded,
    anchorRef: fieldRef,
    floatingRef: listRef,
    side: 'bottom',
    align: 'start',
    sideOffset,
  });
  const position = side === 'top' ? 'top' : 'bottom';
  const anchorSeenRef = React.useRef(false);
  const [emptySlot, setEmptySlot] = React.useState<HTMLDivElement | null>(null);

  useClickOutside(listRef, fieldRef, closeList, expanded, layer.isInsideUpperLayer);

  React.useLayoutEffect(() => {
    setName(listboxNameFor(inputRef.current, inputId));
  }, [expanded, inputRef, inputId]);

  React.useEffect(() => {
    if (!expanded) {
      anchorSeenRef.current = false;
      return;
    }
    if (anchorWidth !== undefined && !anchorHidden) anchorSeenRef.current = true;
    else if (anchorHidden && anchorSeenRef.current) closeList();
  }, [expanded, anchorHidden, anchorWidth, closeList]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list || !expanded) return;
    const optionFrom = (event: Event) => {
      const option = (event.target as Element | null)?.closest<HTMLElement>('[role="option"]');
      if (!option || option.getAttribute('aria-disabled') === 'true') return null;
      return option;
    };
    const handleMove = (event: MouseEvent) => {
      const option = optionFrom(event);
      if (option) setActiveKey(keyOf(option));
    };
    const handleClick = (event: MouseEvent) => {
      const option = optionFrom(event);
      const key = option ? keyOf(option) : null;
      if (key !== null) activate(key);
    };
    const handleMouseDown = (event: MouseEvent) => event.preventDefault();
    list.addEventListener('mousedown', handleMouseDown);
    list.addEventListener('mousemove', handleMove);
    list.addEventListener('click', handleClick);
    return () => {
      list.removeEventListener('mousedown', handleMouseDown);
      list.removeEventListener('mousemove', handleMove);
      list.removeEventListener('click', handleClick);
    };
  }, [listRef, expanded, setActiveKey, activate]);

  const closedState = shouldReduceMotion
    ? { ...CONTENT_CLOSED[position], scale: 1, y: 0, transition: still }
    : CONTENT_CLOSED[position];

  const style = React.useMemo(
    () => ({ ...floatingStyle, visibility: undefined, ...CONTENT_STYLE }),
    [floatingStyle],
  );

  return (
    <FloatingPortal>
      <motion.div
        ref={listRef}
        aria-hidden={!expanded}
        data-slot="combobox-content"
        data-state={expanded ? 'open' : 'closed'}
        data-side={position}
        initial={false}
        animate={
          expanded
            ? shouldReduceMotion
              ? { ...CONTENT_OPEN, transition: still }
              : CONTENT_OPEN
            : closedState
        }
        style={style}
        className={cn(
          'bg-popover text-popover-foreground border-border z-500 max-h-[min(18rem,var(--available-height,18rem))] w-(--anchor-width) overflow-y-auto overscroll-contain rounded-md border p-1 shadow-md outline-none',
          floatingOrigin[position],
          !expanded && 'pointer-events-none',
          className,
        )}
        inert={!expanded}
      >
        {loading && (
          <div
            data-slot="combobox-loading"
            className="text-muted-foreground flex items-center gap-2 px-2 py-1.5 text-sm"
          >
            <LoaderIcon
              size={16}
              className="size-4 animate-spin motion-reduce:[animation-duration:2.5s]"
            />
            {loadingLabel}
          </div>
        )}
        <div ref={setEmptySlot} />
        <div
          id={listId}
          role="listbox"
          {...name}
          aria-multiselectable={multiple || undefined}
          data-slot="combobox-list"
          className="flex flex-col outline-none"
        >
          <ComboboxSlotContext value={emptySlot}>{children}</ComboboxSlotContext>
        </div>
      </motion.div>
    </FloatingPortal>
  );
};

const ComboboxItem = ({
  value,
  children,
  textValue,
  disabled = false,
  className,
}: ComboboxItemProps): React.JSX.Element => {
  const { selectedValues, registry, matches, query, highlightedKey, optionId, registerItem } =
    useComboboxContext();
  const group = React.use(ComboboxGroupContext);
  const registerGroupValue = group?.registerValue;
  const itemRef = React.useRef<HTMLDivElement>(null);
  const isSelected = selectedValues.includes(value);
  const isHighlighted = highlightedKey === value;

  const staticLabel = textValue ?? (typeof children === 'string' ? children : undefined);

  React.useLayoutEffect(() => {
    const label = staticLabel ?? itemRef.current?.textContent ?? '';
    return registerItem(value, label.trim());
  }, [value, staticLabel, registerItem]);

  React.useLayoutEffect(() => registerGroupValue?.(value), [registerGroupValue, value]);

  const label = staticLabel ?? registry.items.get(value) ?? '';
  const visible = matches(label);

  return (
    <div
      ref={itemRef}
      id={optionId(value)}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      hidden={!visible}
      data-slot="combobox-item"
      data-value={value}
      data-selected={isSelected}
      data-highlighted={isHighlighted || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        ITEM_CLASS,
        'pe-8',
        disabled && 'pointer-events-none opacity-40',
        !visible && 'hidden',
        className,
      )}
    >
      <span className="flex-1 truncate">
        {typeof children === 'string' ? highlightMatch(children, query) : children}
      </span>
      {isSelected && (
        <span className="absolute end-2 flex items-center" aria-hidden="true">
          <CheckIcon size={16} className="size-4" />
        </span>
      )}
    </div>
  );
};

const ComboboxGroup = ({ children, className }: ComboboxGroupProps): React.JSX.Element => {
  const { registry, matches } = useComboboxContext();
  const labelId = React.useId();
  const [labelCount, setLabelCount] = React.useState(0);
  const [values, setValues] = React.useState<ReadonlySet<string>>(() => new Set());

  const registerLabel = React.useCallback(() => {
    setLabelCount((count) => count + 1);
    return () => setLabelCount((count) => count - 1);
  }, []);

  const registerValue = React.useCallback((itemValue: string) => {
    setValues((previous) => {
      if (previous.has(itemValue)) return previous;
      const next = new Set(previous);
      next.add(itemValue);
      return next;
    });
    return () => {
      setValues((previous) => {
        if (!previous.has(itemValue)) return previous;
        const next = new Set(previous);
        next.delete(itemValue);
        return next;
      });
    };
  }, []);

  const visible = Array.from(values).some((itemValue) => {
    const label = registry.items.get(itemValue);
    return label !== undefined && matches(label);
  });

  const contextValue = React.useMemo(
    () => ({ labelId, registerLabel, registerValue }),
    [labelId, registerLabel, registerValue],
  );

  return (
    <ComboboxGroupContext value={contextValue}>
      <div
        role="group"
        aria-labelledby={labelCount > 0 ? labelId : undefined}
        hidden={!visible}
        data-slot="combobox-group"
        className={cn('flex flex-col', !visible && 'hidden', className)}
      >
        {children}
      </div>
    </ComboboxGroupContext>
  );
};

const ComboboxLabel = ({ children, className }: ComboboxLabelProps): React.JSX.Element => {
  const group = React.use(ComboboxGroupContext);
  const registerLabel = group?.registerLabel;

  React.useLayoutEffect(() => registerLabel?.(), [registerLabel]);

  return (
    <div
      id={group?.labelId}
      role="presentation"
      data-slot="combobox-label"
      className={cn('text-muted-foreground px-2 py-1.5 text-xs font-medium', className)}
    >
      {children}
    </div>
  );
};

const ComboboxSeparator = ({ className }: ComboboxSeparatorProps): React.JSX.Element | null => {
  const { query } = useComboboxContext();
  if (query) return null;
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="combobox-separator"
      className={cn('bg-border/50 my-1 h-px', className)}
    />
  );
};

const ComboboxEmpty = ({ children, className }: ComboboxEmptyProps): React.JSX.Element | null => {
  const { emptyVisible, registerEmpty } = useComboboxContext();
  const slot = React.use(ComboboxSlotContext);

  React.useLayoutEffect(() => registerEmpty(), [registerEmpty]);

  if (!emptyVisible || !slot) return null;

  return createPortal(
    <div
      data-slot="combobox-empty"
      className={cn('text-muted-foreground px-2 py-6 text-center text-sm', className)}
    >
      {children}
    </div>,
    slot,
  );
};

const ComboboxCreate = ({
  onCreate,
  children,
  className,
}: ComboboxCreateProps): React.JSX.Element | null => {
  const { createVisible, query, highlightedKey, createId, registerCreate } = useComboboxContext();
  const onCreateRef = React.useRef(onCreate);

  React.useLayoutEffect(() => {
    onCreateRef.current = onCreate;
  });

  React.useLayoutEffect(
    () => registerCreate((text: string) => onCreateRef.current(text)),
    [registerCreate],
  );

  if (!createVisible) return null;

  const isHighlighted = highlightedKey === CREATE_KEY;
  const content =
    typeof children === 'function' ? children(query) : (children ?? `Create "${query}"`);

  return (
    <div
      id={createId}
      role="option"
      aria-selected={false}
      data-slot="combobox-create"
      data-create=""
      data-highlighted={isHighlighted || undefined}
      className={cn(ITEM_CLASS, 'pe-2', className)}
    >
      <PlusIcon size={16} className="text-muted-foreground size-4 shrink-0" />
      <span className="flex-1 truncate">{content}</span>
    </div>
  );
};

const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
  Item: ComboboxItem,
  Group: ComboboxGroup,
  Label: ComboboxLabel,
  Separator: ComboboxSeparator,
  Empty: ComboboxEmpty,
  Create: ComboboxCreate,
  Clear: ComboboxClear,
});

export { Combobox };
export type {
  ComboboxClearProps,
  ComboboxContentProps,
  ComboboxCreateHandler,
  ComboboxCreateProps,
  ComboboxEmptyProps,
  ComboboxFilter,
  ComboboxGroupProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxLabelProps,
  ComboboxProps,
  ComboboxSeparatorProps,
};
