'use client';

import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

interface SelectContextValue {
  value: string;
  selectValue: (value: string) => void;
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  toggleMenu: () => void;
  disabled: boolean;
  labels: ReadonlyMap<string, string>;
  registerItem: (value: string, label: string) => () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  triggerId: string;
  contentId: string;
}

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  className?: string;
}

interface SelectTriggerProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;
  children?: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  textValue?: string;
  disabled?: boolean;
  className?: string;
}

interface SelectGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectSeparatorProps {
  className?: string;
}

const selectTriggerVariants = cva(
  [
    'border-input bg-transparent text-foreground flex w-full items-center justify-between gap-2 rounded-md border text-left transition-[color,box-shadow] outline-none',
    'dark:bg-input/30 hover:border-border-interactive',
    'focus-visible:border-foreground/40 focus-visible:ring-foreground/10 focus-visible:ring-[1px]',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/30',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
    'data-[placeholder=true]:text-muted-foreground',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs',
        default: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const ICON_VARIANTS = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
} as const;

const ICON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;
const ICON_STYLE = { willChange: 'transform' } as const;
const CONTENT_STYLE = { willChange: 'opacity, transform' } as const;

const CONTENT_OPEN = {
  opacity: 1,
  scale: 1,
  y: 0,
  visibility: 'visible' as const,
  transition: { type: 'spring', duration: 0.3, bounce: 0, opacity: { duration: 0.15 } },
} as const;

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

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelectContext = (): SelectContextValue => {
  const context = React.use(SelectContext);
  if (!context) throw new Error('Select components must be used within Select');
  return context;
};

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        ref.current?.contains(event.target as Node) ||
        triggerRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, triggerRef, handler, enabled]);
}

function getOptions(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'),
  );
}

function focusOption(container: HTMLElement | null, value: string) {
  const options = getOptions(container);
  const selected = options.find((option) => option.dataset.value === value);
  (selected ?? options[0])?.focus();
}

const SelectRoot = ({
  children,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  name,
  required,
  className,
}: SelectProps): React.JSX.Element => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [labels, setLabels] = React.useState<ReadonlyMap<string, string>>(() => new Map());
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : uncontrolledValue;

  const isOpenControlled = controlledOpen !== undefined;
  const isOpen = isOpenControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const openMenu = React.useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled, setOpen]);

  const closeMenu = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      setOpen(false);
      if (options?.restoreFocus !== false) triggerRef.current?.focus();
    },
    [setOpen],
  );

  const toggleMenu = React.useCallback(() => {
    if (disabled) return;
    setOpen(!isOpen);
  }, [disabled, isOpen, setOpen]);

  const selectValue = React.useCallback(
    (next: string) => {
      if (!isValueControlled) setUncontrolledValue(next);
      if (next !== value) onValueChange?.(next);
      closeMenu();
    },
    [isValueControlled, value, onValueChange, closeMenu],
  );

  const registerItem = React.useCallback((itemValue: string, label: string) => {
    setLabels((prev) => {
      if (prev.get(itemValue) === label) return prev;
      const next = new Map(prev);
      next.set(itemValue, label);
      return next;
    });
    return () => {
      setLabels((prev) => {
        if (!prev.has(itemValue)) return prev;
        const next = new Map(prev);
        next.delete(itemValue);
        return next;
      });
    };
  }, []);

  const id = React.useId();
  const triggerId = `select-trigger-${id}`;
  const contentId = `select-content-${id}`;

  const contextValue = React.useMemo(
    () => ({
      value,
      selectValue,
      isOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      disabled,
      labels,
      registerItem,
      triggerRef,
      listRef,
      triggerId,
      contentId,
    }),
    [
      value,
      selectValue,
      isOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      disabled,
      labels,
      registerItem,
      triggerId,
      contentId,
    ],
  );

  return (
    <SelectContext value={contextValue}>
      <div className={cn('relative w-full', className)}>
        {children}
        {name && <input type="hidden" name={name} value={value} required={required} />}
      </div>
    </SelectContext>
  );
};

const SelectTrigger = ({
  className,
  size,
  placeholder,
  children,
  onClick,
  onKeyDown,
  disabled: disabledProp,
  ref,
  ...props
}: SelectTriggerProps & { ref?: React.Ref<HTMLButtonElement> }): React.JSX.Element => {
  const {
    value,
    labels,
    isOpen,
    toggleMenu,
    openMenu,
    disabled,
    triggerRef,
    triggerId,
    contentId,
    listRef,
  } = useSelectContext();

  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

  const label = value ? labels.get(value) : undefined;
  const showPlaceholder = !label;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) toggleMenu();
    },
    [onClick, toggleMenu],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
        requestAnimationFrame(() => focusOption(listRef.current, value));
      }
    },
    [onKeyDown, openMenu, listRef, value],
  );

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      id={triggerId}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={isOpen ? contentId : undefined}
      data-placeholder={showPlaceholder}
      data-state={isOpen ? 'open' : 'closed'}
      disabled={disabled || disabledProp}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      <span className="truncate">{children ?? label ?? placeholder ?? ' '}</span>
      <motion.span
        aria-hidden="true"
        variants={ICON_VARIANTS}
        animate={isOpen ? 'open' : 'closed'}
        transition={ICON_TRANSITION}
        style={ICON_STYLE}
        className="text-muted-foreground flex shrink-0"
      >
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="size-4" />
      </motion.span>
    </button>
  );
};

const SelectContent = ({
  children,
  className,
  sideOffset = 4,
}: SelectContentProps): React.JSX.Element => {
  const { isOpen, closeMenu, selectValue, contentId, triggerId, triggerRef, listRef } =
    useSelectContext();
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = React.useState<'bottom' | 'top'>('bottom');

  const closeWithoutFocus = React.useCallback(
    () => closeMenu({ restoreFocus: false }),
    [closeMenu],
  );

  useClickOutside(listRef, triggerRef, closeWithoutFocus, isOpen);

  React.useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentHeight = listRef.current?.offsetHeight || 240;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    setPosition(spaceBelow < contentHeight + 20 ? 'top' : 'bottom');
  }, [isOpen, triggerRef, listRef]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const options = getOptions(listRef.current);
      const currentIndex = options.findIndex((option) => option === document.activeElement);

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeMenu();
          return;
        case 'Tab':
          closeMenu({ restoreFocus: false });
          return;
        case 'ArrowDown':
          e.preventDefault();
          options[currentIndex < options.length - 1 ? currentIndex + 1 : 0]?.focus();
          return;
        case 'ArrowUp':
          e.preventDefault();
          options[currentIndex > 0 ? currentIndex - 1 : options.length - 1]?.focus();
          return;
        case 'Home':
          e.preventDefault();
          options[0]?.focus();
          return;
        case 'End':
          e.preventDefault();
          options[options.length - 1]?.focus();
          return;
        case 'Enter':
        case ' ': {
          e.preventDefault();
          const active = options[currentIndex];
          if (active?.dataset.value !== undefined) selectValue(active.dataset.value);
          return;
        }
        default: {
          if (e.key.length !== 1 || e.altKey || e.ctrlKey || e.metaKey) return;
          const char = e.key.toLowerCase();
          const ordered = [
            ...options.slice(currentIndex + 1),
            ...options.slice(0, currentIndex + 1),
          ];
          ordered
            .find((option) => option.textContent?.trim().toLowerCase().startsWith(char))
            ?.focus();
        }
      }
    },
    [listRef, closeMenu, selectValue],
  );

  const verticalStyle =
    position === 'bottom'
      ? { top: `calc(100% + ${sideOffset}px)` }
      : { bottom: `calc(100% + ${sideOffset}px)` };

  return (
    <motion.div
      ref={listRef}
      id={contentId}
      role="listbox"
      aria-labelledby={triggerId}
      aria-hidden={!isOpen}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      initial={false}
      animate={
        isOpen
          ? shouldReduceMotion
            ? { ...CONTENT_OPEN, transition: { duration: 0 } }
            : CONTENT_OPEN
          : CONTENT_CLOSED[position]
      }
      style={{ ...verticalStyle, ...CONTENT_STYLE }}
      className={cn(
        'bg-popover text-popover-foreground border-border absolute right-0 left-0 z-50 max-h-72 overflow-y-auto rounded-md border p-1 shadow-md outline-none',
        position === 'bottom' ? 'origin-top' : 'origin-bottom',
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

const SelectItem = ({
  value,
  children,
  textValue,
  disabled = false,
  className,
}: SelectItemProps): React.JSX.Element => {
  const { value: selectedValue, selectValue, registerItem } = useSelectContext();
  const itemRef = React.useRef<HTMLDivElement>(null);
  const isSelected = selectedValue === value;

  React.useLayoutEffect(() => {
    const label =
      textValue ?? (typeof children === 'string' ? children : itemRef.current?.textContent) ?? '';
    return registerItem(value, label.trim());
  }, [value, textValue, children, registerItem]);

  const handleClick = React.useCallback(() => {
    if (!disabled) selectValue(value);
  }, [disabled, selectValue, value]);

  return (
    <div
      ref={itemRef}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-value={value}
      data-selected={isSelected}
      tabIndex={disabled ? undefined : -1}
      onClick={handleClick}
      className={cn(
        'relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2.5 text-sm outline-none select-none',
        'transition-colors duration-150',
        'hover:bg-muted focus-visible:bg-muted focus:bg-muted',
        disabled && 'pointer-events-none opacity-40',
        className,
      )}
    >
      <span className="flex-1 truncate">{children}</span>
      {isSelected && (
        <span className="absolute right-2 flex items-center" aria-hidden="true">
          <HugeiconsIcon icon={Tick02Icon} size={16} className="size-4" />
        </span>
      )}
    </div>
  );
};

const SelectGroup = ({ children, className }: SelectGroupProps): React.JSX.Element => (
  <div role="group" className={cn('flex flex-col', className)}>
    {children}
  </div>
);

const SelectLabel = ({ children, className }: SelectLabelProps): React.JSX.Element => (
  <div
    role="presentation"
    className={cn(
      'text-muted-foreground px-2.5 py-1.5 text-xs font-semibold tracking-wider uppercase',
      className,
    )}
  >
    {children}
  </div>
);

const SelectSeparator = ({ className }: SelectSeparatorProps): React.JSX.Element => (
  <div
    role="separator"
    aria-orientation="horizontal"
    className={cn('bg-border/50 my-1 h-px', className)}
  />
);

const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
});

export { Select, selectTriggerVariants };
export type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectSeparatorProps,
  SelectTriggerProps,
};
