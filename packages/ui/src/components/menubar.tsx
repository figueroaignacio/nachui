'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { getNavigationIndex, isTypeaheadKey, useTypeahead } from '../lib/collection';
import { type Direction, resolveDirection, useDirection } from '../lib/direction';
import { type FloatingAlign, FloatingPortal, useFloating } from '../lib/floating';
import { type FloatingSide, floatingVariants, reveal } from '../lib/motion';
import { assignRef, useLayer } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function CheckIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DotIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function ChevronRightIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

type FocusTarget = 'first' | 'last' | 'none';

type MenubarItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

interface MenubarContextValue {
  value: string;
  dir: Direction;
  tabStop: string;
  setTabStop: (value: string) => void;
  openMenu: (value: string, focus?: FocusTarget) => void;
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  moveMenu: (from: string, key: string, open: boolean) => boolean;
  focusTargetRef: React.RefObject<FocusTarget>;
  rootRef: React.RefObject<HTMLDivElement | null>;
}

interface MenubarMenuContextValue {
  value: string;
  open: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triggerId: string;
  contentId: string;
}

interface MenubarLevelContextValue {
  open: boolean;
  activeSub: string | null;
  setActiveSub: React.Dispatch<React.SetStateAction<string | null>>;
}

interface MenubarSubContextValue {
  open: boolean;
  openSub: (focus: FocusTarget) => void;
  closeSub: (options?: { restoreFocus?: boolean }) => void;
  focusTargetRef: React.RefObject<FocusTarget>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triggerId: string;
  contentId: string;
}

interface MenubarRadioGroupContextValue {
  value: string;
  setValue: (value: string) => void;
}

interface MenubarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'dir'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  dir?: Direction;
  loop?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

interface MenubarMenuProps {
  children: React.ReactNode;
  value?: string;
}

interface MenubarTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

interface MenubarContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

interface MenubarItemProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onSelect?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  shortcut?: React.ReactNode;
  closeOnSelect?: boolean;
}

interface MenubarCheckboxItemProps extends MenubarItemProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

interface MenubarRadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface MenubarRadioItemProps extends MenubarItemProps {
  value: string;
}

interface MenubarSubProps {
  children: React.ReactNode;
}

interface MenubarSubTriggerProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface MenubarSubContentProps {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
}

interface MenubarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface MenubarSurfaceProps {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  id: string;
  labelledBy: string;
  slot: string;
  dir: Direction;
  side: FloatingSide;
  align: FloatingAlign;
  sideOffset: number;
  alignOffset: number;
  anchorRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  focusTargetRef: React.RefObject<FocusTarget>;
  outsideRef?: React.RefObject<HTMLElement | null>;
  onOutside?: () => void;
  onEscape: () => void;
  onTab: () => void;
  onHorizontal: (key: string, forward: boolean) => void;
}

const MENUBAR_CONTENT_STYLE = { willChange: 'opacity, transform, filter' } as const;

const ORIGIN_CLASSES: Record<FloatingSide, Record<FloatingAlign, string>> = {
  bottom: { start: 'origin-top-left', center: 'origin-top', end: 'origin-top-right' },
  top: { start: 'origin-bottom-left', center: 'origin-bottom', end: 'origin-bottom-right' },
  right: { start: 'origin-top-left', center: 'origin-left', end: 'origin-bottom-left' },
  left: { start: 'origin-top-right', center: 'origin-right', end: 'origin-bottom-right' },
};

const ITEM_SELECTOR = ['menuitem', 'menuitemcheckbox', 'menuitemradio']
  .map((role) => `[role="${role}"]:not([aria-disabled="true"])`)
  .join(', ');

const MenubarContext = React.createContext<MenubarContextValue | null>(null);
const MenubarMenuContext = React.createContext<MenubarMenuContextValue | null>(null);
const MenubarSurfaceContext = React.createContext(false);
const MenubarLevelContext = React.createContext<MenubarLevelContextValue | null>(null);
const MenubarSubContext = React.createContext<MenubarSubContextValue | null>(null);
const MenubarRadioGroupContext = React.createContext<MenubarRadioGroupContextValue | null>(null);

const useMenubarContext = (): MenubarContextValue => {
  const context = React.use(MenubarContext);
  if (!context) throw new Error('Menubar components must be used within Menubar');
  return context;
};

const useMenubarMenuContext = (): MenubarMenuContextValue => {
  const context = React.use(MenubarMenuContext);
  if (!context)
    throw new Error('Menubar.Trigger and Menubar.Content must be used within Menubar.Menu');
  return context;
};

const useMenubarSubContext = (): MenubarSubContextValue => {
  const context = React.use(MenubarSubContext);
  if (!context)
    throw new Error('Menubar.SubTrigger and Menubar.SubContent must be used within Menubar.Sub');
  return context;
};

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null> | undefined,
  handler: (() => void) | undefined,
  enabled: boolean,
  isInsideUpperLayer: (target: EventTarget | null) => boolean,
) {
  React.useEffect(() => {
    if (!enabled || !handler) return;
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        ref.current?.contains(event.target as Node) ||
        triggerRef?.current?.contains(event.target as Node) ||
        isInsideUpperLayer(event.target)
      ) {
        return;
      }
      handler();
    };
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [ref, triggerRef, handler, enabled, isInsideUpperLayer]);
}

function getTriggers(root: HTMLElement | null): HTMLButtonElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-slot="menubar-trigger"]:not([disabled])'),
  );
}

function getMenuItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
}

function focusEdge(container: HTMLElement | null, edge: FocusTarget) {
  if (edge === 'none') return;
  const items = getMenuItems(container);
  (edge === 'last' ? items[items.length - 1] : items[0])?.focus();
}

const MenubarRoot = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  dir: dirProp,
  loop = true,
  className,
  children,
  ref,
  ...props
}: MenubarProps): React.JSX.Element => {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const explicitDir = useDirection(dirProp);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const focusTargetRef = React.useRef<FocusTarget>('first');
  const [tabStop, setTabStop] = React.useState('');
  const [dir, setDir] = React.useState<Direction>(explicitDir ?? 'ltr');

  React.useLayoutEffect(() => {
    setDir(resolveDirection(rootRef.current, explicitDir));
  }, [explicitDir]);

  React.useLayoutEffect(() => {
    const triggers = getTriggers(rootRef.current);
    if (triggers.some((trigger) => trigger.dataset.value === tabStop)) return;
    setTabStop(triggers[0]?.dataset.value ?? '');
  }, [children, tabStop]);

  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const openMenu = React.useCallback(
    (next: string, focus: FocusTarget = 'first') => {
      focusTargetRef.current = focus;
      setTabStop(next);
      setValue(next);
    },
    [setValue],
  );

  const closeMenu = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      const trigger = getTriggers(rootRef.current).find(
        (candidate) => candidate.dataset.value === value,
      );
      setValue('');
      if (options?.restoreFocus !== false) trigger?.focus();
    },
    [setValue, value],
  );

  const moveMenu = React.useCallback(
    (from: string, key: string, open: boolean) => {
      const triggers = getTriggers(rootRef.current);
      const current = triggers.findIndex((trigger) => trigger.dataset.value === from);
      const index = getNavigationIndex(key, current, triggers.length, {
        orientation: 'horizontal',
        rtl: resolveDirection(rootRef.current, explicitDir) === 'rtl',
        loop,
      });
      if (index === null) return false;
      const target = triggers[index];
      if (!target) return false;
      const next = target.dataset.value ?? '';
      if (open) {
        if (next !== value) openMenu(next, 'first');
      } else {
        setTabStop(next);
        target.focus();
      }
      return true;
    },
    [explicitDir, loop, openMenu, value],
  );

  const contextValue = React.useMemo(
    () => ({
      value,
      dir,
      tabStop,
      setTabStop,
      openMenu,
      closeMenu,
      moveMenu,
      focusTargetRef,
      rootRef,
    }),
    [value, dir, tabStop, openMenu, closeMenu, moveMenu],
  );

  return (
    <MenubarContext value={contextValue}>
      <div
        ref={setRootRef}
        role="menubar"
        dir={dirProp}
        data-slot="menubar"
        className={cn(
          'bg-card border-border flex items-center gap-1 rounded-md border p-1',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </MenubarContext>
  );
};

const MenubarMenu = ({ children, value: valueProp }: MenubarMenuProps): React.JSX.Element => {
  const root = useMenubarContext();
  const id = React.useId();
  const value = valueProp ?? `menubar-menu-${id}`;
  const open = root.value !== '' && root.value === value;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const triggerId = `menubar-trigger-${id}`;
  const contentId = `menubar-content-${id}`;

  const contextValue = React.useMemo(
    () => ({ value, open, triggerRef, contentRef, triggerId, contentId }),
    [value, open, triggerId, contentId],
  );

  return <MenubarMenuContext value={contextValue}>{children}</MenubarMenuContext>;
};

const MenubarTrigger = ({
  children,
  className,
  disabled = false,
  onClick,
  onKeyDown,
  onPointerEnter,
  onFocus,
  ref,
  ...props
}: MenubarTriggerProps): React.JSX.Element => {
  const root = useMenubarContext();
  const menu = useMenubarMenuContext();
  const { triggerRef } = menu;

  const setTriggerRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      assignRef(ref, node);
    },
    [triggerRef, ref],
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    if (!menu.open) {
      root.openMenu(menu.value, 'first');
      return;
    }
    if (e.detail === 0) focusEdge(menu.contentRef.current, 'first');
    else root.closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        const edge = e.key === 'ArrowUp' ? 'last' : 'first';
        if (menu.open) focusEdge(menu.contentRef.current, edge);
        else root.openMenu(menu.value, edge);
        return;
      }
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        if (root.moveMenu(menu.value, e.key, root.value !== '')) e.preventDefault();
        return;
      case 'Escape':
        if (!menu.open) return;
        e.preventDefault();
        root.closeMenu();
        return;
      case 'Tab':
        if (root.value !== '') root.closeMenu({ restoreFocus: false });
        return;
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerEnter?.(e);
    if (disabled || e.pointerType === 'touch') return;
    if (root.value === '' || menu.open) return;
    root.openMenu(menu.value, 'none');
    e.currentTarget.focus();
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    onFocus?.(e);
    root.setTabStop(menu.value);
  };

  return (
    <button
      ref={setTriggerRef}
      type="button"
      role="menuitem"
      id={menu.triggerId}
      aria-haspopup="menu"
      aria-expanded={menu.open}
      aria-controls={menu.open ? menu.contentId : undefined}
      tabIndex={root.tabStop === '' || root.tabStop === menu.value ? 0 : -1}
      disabled={disabled}
      data-slot="menubar-trigger"
      data-value={menu.value}
      data-state={menu.open ? 'open' : 'closed'}
      data-disabled={disabled || undefined}
      className={cn(
        'text-foreground flex items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none select-none',
        'hover:bg-muted data-[state=open]:bg-muted transition-colors duration-150',
        'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onFocus={handleFocus}
    >
      {children}
    </button>
  );
};

const MenubarLevel = ({ children }: { children: React.ReactNode }) => {
  const open = React.use(MenubarSurfaceContext);
  const [activeSub, setActiveSub] = React.useState<string | null>(null);

  const contextValue = React.useMemo(() => ({ open, activeSub, setActiveSub }), [open, activeSub]);

  return <MenubarLevelContext value={contextValue}>{children}</MenubarLevelContext>;
};

const MenubarSurface = ({
  children,
  className,
  open,
  id,
  labelledBy,
  slot,
  dir,
  side,
  align,
  sideOffset,
  alignOffset,
  anchorRef,
  contentRef,
  focusTargetRef,
  outsideRef,
  onOutside,
  onEscape,
  onTab,
  onHorizontal,
}: MenubarSurfaceProps): React.JSX.Element => {
  const layer = useLayer(open, false, contentRef);
  const typeahead = useTypeahead();
  const shouldReduceMotion = useReducedMotion();
  const { style: floatingStyle, side: resolvedSide } = useFloating({
    open,
    anchorRef,
    floatingRef: contentRef,
    side,
    align,
    sideOffset,
    alignOffset,
  });

  useClickOutside(contentRef, outsideRef, onOutside, open, layer.isInsideUpperLayer);

  React.useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      focusEdge(contentRef.current, focusTargetRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [open, contentRef, focusTargetRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = contentRef.current;
    if (!container || !container.contains(e.target as Node)) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onEscape();
      return;
    }
    if (e.key === 'Tab') {
      onTab();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const forward = e.key === (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      const active = document.activeElement;
      if (
        forward &&
        active instanceof HTMLElement &&
        active.dataset.slot === 'menubar-sub-trigger' &&
        container.contains(active)
      ) {
        return;
      }
      e.preventDefault();
      onHorizontal(e.key, forward);
      return;
    }

    const items = getMenuItems(container);
    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    let nextIndex: number | null = null;
    if (e.key === 'ArrowDown') {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      nextIndex =
        currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
    } else if (isTypeaheadKey(e, typeahead.isTyping())) {
      e.preventDefault();
      e.stopPropagation();
      typeahead.search(e.key, items, currentIndex)?.focus();
      return;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      items[nextIndex]?.focus();
    }
  };

  const style = React.useMemo(
    () => ({
      ...floatingStyle,
      ...(open ? null : { visibility: undefined }),
      ...MENUBAR_CONTENT_STYLE,
    }),
    [floatingStyle, open],
  );

  return (
    <MenubarSurfaceContext value={open}>
      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={contentRef}
              id={id}
              role="menu"
              tabIndex={-1}
              dir={dir}
              aria-labelledby={labelledBy}
              data-slot={slot}
              data-state="open"
              data-side={resolvedSide}
              onKeyDownCapture={handleKeyDown}
              variants={shouldReduceMotion ? reveal : floatingVariants[resolvedSide]}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={style}
              className={cn(
                'bg-popover text-popover-foreground border-border z-500 max-h-(--available-height) min-w-48 overflow-y-auto overscroll-contain rounded-md border shadow-md outline-none',
                ORIGIN_CLASSES[resolvedSide][align],
                className,
              )}
            >
              <MenubarLevel>
                <div className="flex flex-col gap-0.5 p-1">{children}</div>
              </MenubarLevel>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </MenubarSurfaceContext>
  );
};

const MenubarContent = ({
  children,
  className,
  align = 'start',
  sideOffset = 6,
}: MenubarContentProps): React.JSX.Element => {
  const root = useMenubarContext();
  const menu = useMenubarMenuContext();
  const rtl = root.dir === 'rtl';
  const physicalAlign: FloatingAlign =
    align === 'center' ? 'center' : (align === 'start') === !rtl ? 'start' : 'end';

  const { closeMenu } = root;
  const dismiss = React.useCallback(() => closeMenu({ restoreFocus: false }), [closeMenu]);

  return (
    <MenubarSurface
      open={menu.open}
      id={menu.contentId}
      labelledBy={menu.triggerId}
      slot="menubar-content"
      dir={root.dir}
      side="bottom"
      align={physicalAlign}
      sideOffset={sideOffset}
      alignOffset={0}
      anchorRef={menu.triggerRef}
      contentRef={menu.contentRef}
      focusTargetRef={root.focusTargetRef}
      outsideRef={root.rootRef}
      onOutside={dismiss}
      onEscape={() => root.closeMenu()}
      onTab={() => root.closeMenu()}
      onHorizontal={(key) => root.moveMenu(menu.value, key, true)}
      className={className}
    >
      {children}
    </MenubarSurface>
  );
};

const itemClassName = (disabled: boolean, variant: 'default' | 'destructive') =>
  cn(
    'relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
    'transition-colors duration-150',
    'focus:bg-muted pointer-coarse:py-2.5',
    disabled && 'pointer-events-none opacity-40',
    variant === 'destructive' && 'text-destructive-text focus:text-destructive-text',
  );

const MenubarShortcut = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    data-slot="menubar-shortcut"
    className={cn('text-muted-foreground ms-auto ps-6 text-xs tracking-widest', className)}
  >
    {children}
  </span>
);

interface MenubarItemBaseProps extends MenubarItemProps {
  role: MenubarItemRole;
  slot: string;
  checked?: boolean;
  indicator?: React.ReactNode;
}

const MenubarItemBase = ({
  children,
  onClick,
  onSelect,
  className,
  disabled = false,
  variant = 'default',
  shortcut,
  role,
  slot,
  checked,
  indicator,
  closeOnSelect = role === 'menuitem',
}: MenubarItemBaseProps): React.JSX.Element => {
  const { closeMenu } = useMenubarContext();
  const level = React.use(MenubarLevelContext);
  const checkable = role !== 'menuitem';

  const select = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    onSelect?.();
    if (closeOnSelect) closeMenu();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.stopPropagation();
    select(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    select(e as unknown as React.MouseEvent<HTMLDivElement>);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.pointerType === 'touch') return;
    level?.setActiveSub(null);
    if (document.activeElement !== e.currentTarget) e.currentTarget.focus();
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (document.activeElement !== e.currentTarget) return;
    e.currentTarget.closest<HTMLElement>('[role="menu"]')?.focus();
  };

  return (
    <div
      role={role}
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      aria-checked={checkable ? Boolean(checked) : undefined}
      data-slot={slot}
      data-state={checkable ? (checked ? 'checked' : 'unchecked') : undefined}
      data-disabled={disabled || undefined}
      data-variant={variant}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(itemClassName(disabled, variant), checkable && 'ps-8', className)}
    >
      {indicator}
      {children}
      {shortcut !== undefined && shortcut !== null && <MenubarShortcut>{shortcut}</MenubarShortcut>}
    </div>
  );
};

const MenubarItem = (props: MenubarItemProps): React.JSX.Element => (
  <MenubarItemBase {...props} role="menuitem" slot="menubar-item" />
);

const MenubarCheckboxItem = ({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onSelect,
  ...props
}: MenubarCheckboxItemProps): React.JSX.Element => {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <MenubarItemBase
      {...props}
      role="menuitemcheckbox"
      slot="menubar-checkbox-item"
      checked={checked}
      onSelect={() => {
        setChecked(!checked);
        onSelect?.();
      }}
      indicator={
        <span className="absolute start-2 flex size-4 items-center justify-center">
          {checked && <CheckIcon size={14} />}
        </span>
      }
    />
  );
};

const MenubarRadioGroup = ({
  children,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  className,
  ...props
}: MenubarRadioGroupProps): React.JSX.Element => {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const contextValue = React.useMemo(() => ({ value, setValue }), [value, setValue]);

  return (
    <MenubarRadioGroupContext value={contextValue}>
      <div
        role="group"
        data-slot="menubar-radio-group"
        className={cn('flex flex-col gap-0.5', className)}
        {...props}
      >
        {children}
      </div>
    </MenubarRadioGroupContext>
  );
};

const MenubarRadioItem = ({
  value,
  onSelect,
  closeOnSelect = true,
  ...props
}: MenubarRadioItemProps): React.JSX.Element => {
  const group = React.use(MenubarRadioGroupContext);
  if (!group) throw new Error('Menubar.RadioItem must be used within Menubar.RadioGroup');
  const checked = group.value === value;

  return (
    <MenubarItemBase
      {...props}
      role="menuitemradio"
      slot="menubar-radio-item"
      checked={checked}
      closeOnSelect={closeOnSelect}
      onSelect={() => {
        if (!checked) group.setValue(value);
        onSelect?.();
      }}
      indicator={
        <span className="absolute start-2 flex size-4 items-center justify-center">
          {checked && <DotIcon size={14} />}
        </span>
      }
    />
  );
};

const MenubarSub = ({ children }: MenubarSubProps): React.JSX.Element => {
  const level = React.use(MenubarLevelContext);
  if (!level) throw new Error('Menubar.Sub must be used within Menubar.Content');
  const id = React.useId();
  const open = level.open && level.activeSub === id;
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const focusTargetRef = React.useRef<FocusTarget>('none');
  const { setActiveSub } = level;

  const openSub = React.useCallback(
    (focus: FocusTarget) => {
      focusTargetRef.current = focus;
      if (open) focusEdge(contentRef.current, focus);
      else setActiveSub(id);
    },
    [open, setActiveSub, id],
  );

  const closeSub = React.useCallback(
    (options?: { restoreFocus?: boolean }) => {
      setActiveSub((current) => (current === id ? null : current));
      if (options?.restoreFocus !== false) triggerRef.current?.focus();
    },
    [setActiveSub, id],
  );

  const contextValue = React.useMemo(
    () => ({
      open,
      openSub,
      closeSub,
      focusTargetRef,
      triggerRef,
      contentRef,
      triggerId: `menubar-sub-trigger-${id}`,
      contentId: `menubar-sub-content-${id}`,
    }),
    [open, openSub, closeSub, id],
  );

  return <MenubarSubContext value={contextValue}>{children}</MenubarSubContext>;
};

const MenubarSubTrigger = ({
  children,
  className,
  disabled = false,
}: MenubarSubTriggerProps): React.JSX.Element => {
  const root = useMenubarContext();
  const { open, openSub, triggerRef, triggerId, contentId } = useMenubarSubContext();
  const forwardKey = root.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.stopPropagation();
    openSub(e.detail === 0 ? 'first' : 'none');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== forwardKey) return;
    e.preventDefault();
    e.stopPropagation();
    openSub('first');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.pointerType === 'touch') return;
    if (document.activeElement !== e.currentTarget) e.currentTarget.focus();
    if (!open) openSub('none');
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (document.activeElement !== e.currentTarget) return;
    e.currentTarget.closest<HTMLElement>('[role="menu"]')?.focus();
  };

  return (
    <div
      ref={triggerRef}
      id={triggerId}
      role="menuitem"
      tabIndex={-1}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      aria-disabled={disabled || undefined}
      data-slot="menubar-sub-trigger"
      data-state={open ? 'open' : 'closed'}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(itemClassName(disabled, 'default'), 'data-[state=open]:bg-muted', className)}
    >
      {children}
      <ChevronRightIcon
        size={14}
        className="text-muted-foreground ms-auto size-3.5 rtl:rotate-180"
      />
    </div>
  );
};

const MenubarSubContent = ({
  children,
  className,
  sideOffset = 6,
}: MenubarSubContentProps): React.JSX.Element => {
  const root = useMenubarContext();
  const menu = useMenubarMenuContext();
  const sub = useMenubarSubContext();

  return (
    <MenubarSurface
      open={sub.open}
      id={sub.contentId}
      labelledBy={sub.triggerId}
      slot="menubar-sub-content"
      dir={root.dir}
      side={root.dir === 'rtl' ? 'left' : 'right'}
      align="start"
      sideOffset={sideOffset}
      alignOffset={-5}
      anchorRef={sub.triggerRef}
      contentRef={sub.contentRef}
      focusTargetRef={sub.focusTargetRef}
      onEscape={() => sub.closeSub()}
      onTab={() => root.closeMenu()}
      onHorizontal={(key, forward) => {
        if (forward) root.moveMenu(menu.value, key, true);
        else sub.closeSub();
      }}
      className={className}
    >
      {children}
    </MenubarSurface>
  );
};

const MenubarGroup = ({ children, className, ...props }: MenubarGroupProps): React.JSX.Element => (
  <div
    role="group"
    data-slot="menubar-group"
    className={cn('flex flex-col gap-0.5', className)}
    {...props}
  >
    {children}
  </div>
);

const MenubarLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element => (
  <div
    role="presentation"
    data-slot="menubar-label"
    className={cn('text-muted-foreground px-2 py-2 text-xs font-medium', className)}
  >
    {children}
  </div>
);

const MenubarSeparator = ({ className }: { className?: string }): React.JSX.Element => (
  <div
    role="separator"
    aria-orientation="horizontal"
    data-slot="menubar-separator"
    className={cn('bg-border/50 my-1 h-px', className)}
  />
);

const Menubar = Object.assign(MenubarRoot, {
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
  Item: MenubarItem,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  Sub: MenubarSub,
  SubTrigger: MenubarSubTrigger,
  SubContent: MenubarSubContent,
  Group: MenubarGroup,
  Label: MenubarLabel,
  Separator: MenubarSeparator,
  Shortcut: MenubarShortcut,
});

export { Menubar };
export type {
  MenubarCheckboxItemProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarItemProps,
  MenubarMenuProps,
  MenubarProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarSubContentProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps,
};
