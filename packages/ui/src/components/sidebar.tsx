'use client';

import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { type Direction, resolveDirection, useDirection } from '../lib/direction';
import { springs, still } from '../lib/motion';
import { assignRef } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';
import { Button, type ButtonProps } from './button';
import { Collapsible } from './collapsible';
import { Sheet } from './sheet';
import { Tooltip } from './tooltip';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function PanelStartIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" />
      <path d="M9.5 3.5v17" />
    </svg>
  );
}

type SidebarSide = 'start' | 'end';
type SidebarVariant = 'sidebar' | 'floating' | 'inset';
type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';
type SidebarState = 'expanded' | 'collapsed';

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_ICON = '3.5rem';
const CONTAINER_STYLE = { willChange: 'transform' } as const;

interface SidebarContextValue {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

interface SidebarInternalValue extends SidebarContextValue {
  sidebarId: string;
  mobileId: string;
  dir: Direction;
  vars: React.CSSProperties;
}

interface SidebarSurfaceValue {
  side: SidebarSide;
  collapsible: SidebarCollapsible;
  iconOnly: boolean;
  mobile: boolean;
}

const SidebarContext = React.createContext<SidebarInternalValue | null>(null);

const SidebarSurfaceContext = React.createContext<SidebarSurfaceValue>({
  side: 'start',
  collapsible: 'none',
  iconOnly: false,
  mobile: false,
});

function useSidebarInternal(): SidebarInternalValue {
  const context = React.use(SidebarContext);
  if (!context) throw new Error('Sidebar components must be used within Sidebar.Provider');
  return context;
}

function useSidebar(): SidebarContextValue {
  const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } =
    useSidebarInternal();
  return { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar };
}

function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => undefined;
      }
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(query).matches;
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

interface ParsedShortcut {
  key: string;
  mod: boolean;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
}

function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean);
  const has = (...names: string[]) => names.some((name) => parts.includes(name));
  return {
    key: parts[parts.length - 1] ?? '',
    mod: has('mod'),
    ctrl: has('ctrl', 'control'),
    meta: has('meta', 'cmd', 'command'),
    alt: has('alt', 'option'),
    shift: has('shift'),
  };
}

function matchesShortcut(event: KeyboardEvent, shortcut: ParsedShortcut, apple: boolean) {
  const ctrl = shortcut.ctrl || (shortcut.mod && !apple);
  const meta = shortcut.meta || (shortcut.mod && apple);
  return (
    event.key.toLowerCase() === shortcut.key &&
    event.ctrlKey === ctrl &&
    event.metaKey === meta &&
    event.altKey === shortcut.alt &&
    event.shiftKey === shortcut.shift
  );
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
  mobileBreakpoint?: number;
  shortcut?: string;
}

const SidebarProvider = ({
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  openMobile: controlledOpenMobile,
  onOpenMobileChange,
  mobileBreakpoint = 768,
  shortcut,
  dir: dirProp,
  className,
  style,
  children,
  ref,
  ...props
}: SidebarProviderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [openMobile, setOpenMobile] = useControllableState({
    value: controlledOpenMobile,
    defaultValue: false,
    onChange: onOpenMobileChange,
  });
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 0.02}px)`);
  const inherited = useDirection(dirProp === 'rtl' || dirProp === 'ltr' ? dirProp : undefined);
  const [resolvedDir, setResolvedDir] = React.useState<Direction>('ltr');
  const dir = inherited ?? resolvedDir;
  const id = React.useId();

  const rootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) setResolvedDir(resolveDirection(node));
      assignRef(ref, node);
    },
    [ref],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((value) => !value);
    else setOpen((value) => !value);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    if (!shortcut) return;
    const parsed = parseShortcut(shortcut);
    const apple = /mac|iphone|ipad|ipod/i.test(navigator.userAgent);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || !matchesShortcut(event, parsed, apple)) return;
      event.preventDefault();
      toggleSidebar();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcut, toggleSidebar]);

  const vars = React.useMemo(
    () =>
      ({
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
        ...style,
      }) as React.CSSProperties,
    [style],
  );

  const state: SidebarState = open ? 'expanded' : 'collapsed';

  const context = React.useMemo<SidebarInternalValue>(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      sidebarId: `${id}-sidebar`,
      mobileId: `${id}-sidebar-mobile`,
      dir,
      vars,
    }),
    [state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar, id, dir, vars],
  );

  return (
    <SidebarContext value={context}>
      <div
        ref={rootRef}
        dir={dirProp}
        data-slot="sidebar-wrapper"
        data-state={state}
        style={vars}
        className={cn(
          'group/sidebar-wrapper flex min-h-svh w-full overflow-x-clip',
          'has-[>[data-slot=sidebar][data-variant=inset]]:bg-surface-muted',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  );
};
SidebarProvider.displayName = 'SidebarProvider';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
  label?: string;
}

function iconWidth(variant: SidebarVariant) {
  if (variant === 'floating') return 'w-[calc(var(--sidebar-width-icon)+1rem)]';
  if (variant === 'inset') return 'w-[calc(var(--sidebar-width-icon)+0.5rem)]';
  return 'w-(--sidebar-width-icon)';
}

function surfaceClasses(variant: SidebarVariant, side: SidebarSide) {
  if (variant === 'floating') return 'border-border rounded-lg border shadow-sm';
  if (variant === 'inset') return 'bg-transparent';
  return side === 'start' ? 'border-border border-e' : 'border-border border-s';
}

const SidebarRoot = ({
  side = 'start',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  label = 'Sidebar',
  className,
  children,
  ref,
  ...props
}: SidebarProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { state, isMobile, openMobile, setOpenMobile, sidebarId, mobileId, dir, vars } =
    useSidebarInternal();
  const shouldReduceMotion = useReducedMotion();

  if (collapsible === 'none') {
    return (
      <SidebarSurfaceContext value={{ side, collapsible, iconOnly: false, mobile: false }}>
        <div
          ref={ref}
          id={sidebarId}
          data-slot="sidebar"
          data-state="expanded"
          data-collapsible=""
          data-variant={variant}
          data-side={side}
          className={cn(
            'bg-surface-muted text-foreground flex h-full w-(--sidebar-width) shrink-0 flex-col',
            surfaceClasses(variant, side),
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarSurfaceContext>
    );
  }

  if (isMobile) {
    const physical = (side === 'start') === (dir === 'ltr') ? 'left' : 'right';
    return (
      <SidebarSurfaceContext value={{ side, collapsible, iconOnly: false, mobile: true }}>
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <Sheet.Content
            id={mobileId}
            side={physical}
            showClose={false}
            aria-label={label}
            dir={dir}
            style={vars}
            data-slot="sidebar"
            data-mobile=""
            data-state={openMobile ? 'expanded' : 'collapsed'}
            data-variant={variant}
            className={cn('bg-surface-muted text-foreground w-(--sidebar-width) p-0', className)}
          >
            <div data-slot="sidebar-inner" className="flex size-full flex-col">
              {children}
            </div>
          </Sheet.Content>
        </Sheet>
      </SidebarSurfaceContext>
    );
  }

  const collapsed = state === 'collapsed';
  const iconOnly = collapsed && collapsible === 'icon';
  const offscreen = collapsed && collapsible === 'offcanvas';
  const towardsStart = side === 'start' ? dir === 'ltr' : dir === 'rtl';
  const x = offscreen ? (towardsStart ? '-100%' : '100%') : '0%';

  return (
    <SidebarSurfaceContext value={{ side, collapsible, iconOnly, mobile: false }}>
      <div
        ref={ref}
        data-slot="sidebar"
        data-state={state}
        data-collapsible={collapsed ? collapsible : ''}
        data-variant={variant}
        data-side={side}
        className={cn(
          'group/sidebar text-foreground relative flex shrink-0',
          side === 'end' && 'justify-end',
          offscreen ? 'w-0' : iconOnly ? iconWidth(variant) : 'w-(--sidebar-width)',
          className,
        )}
        {...props}
      >
        <motion.div
          id={sidebarId}
          data-slot="sidebar-container"
          inert={offscreen || undefined}
          initial={false}
          animate={{ x }}
          transition={shouldReduceMotion ? still : springs.smooth}
          style={CONTAINER_STYLE}
          className={cn(
            'sticky top-0 flex h-svh max-h-full shrink-0',
            iconOnly ? iconWidth(variant) : 'w-(--sidebar-width)',
            variant === 'floating' && 'p-2',
            variant === 'inset' && (side === 'start' ? 'py-2 ps-2' : 'py-2 pe-2'),
          )}
        >
          <div
            data-slot="sidebar-inner"
            className={cn(
              'bg-surface-muted relative flex size-full min-w-0 flex-col',
              surfaceClasses(variant, side),
            )}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </SidebarSurfaceContext>
  );
};
SidebarRoot.displayName = 'Sidebar';

type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const SidebarHeader = ({ className, ref, ...props }: SidebarSectionProps) => (
  <div
    ref={ref}
    data-slot="sidebar-header"
    className={cn('flex flex-col gap-2 p-2', className)}
    {...props}
  />
);
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = ({ className, ref, ...props }: SidebarSectionProps) => (
  <div
    ref={ref}
    data-slot="sidebar-footer"
    className={cn('mt-auto flex flex-col gap-2 p-2', className)}
    {...props}
  />
);
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = ({ className, ref, ...props }: SidebarSectionProps) => {
  const { iconOnly } = React.use(SidebarSurfaceContext);
  return (
    <div
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto',
        iconOnly && 'overflow-x-hidden',
        className,
      )}
      {...props}
    />
  );
};
SidebarContent.displayName = 'SidebarContent';

const SidebarGroupLabel = ({ className, ref, ...props }: SidebarSectionProps) => {
  const { iconOnly } = React.use(SidebarSurfaceContext);
  return (
    <div
      ref={ref}
      data-slot="sidebar-group-label"
      className={cn(
        'text-muted-foreground flex h-8 shrink-0 items-center px-2 text-xs font-medium',
        iconOnly && 'sr-only',
        className,
      )}
      {...props}
    />
  );
};
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarGroup = ({
  label,
  collapsible = false,
  open,
  defaultOpen = true,
  onOpenChange,
  className,
  children,
  ref,
  ...props
}: SidebarGroupProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { iconOnly } = React.use(SidebarSurfaceContext);
  const labelId = React.useId();

  if (collapsible && label && !iconOnly) {
    return (
      <Collapsible
        ref={ref}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        data-slot="sidebar-group"
        className={cn('flex w-full min-w-0 flex-col p-2', className)}
        {...props}
      >
        <Collapsible.Trigger
          data-slot="sidebar-group-label"
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring h-8 rounded-sm px-2 text-xs font-medium hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-inset"
        >
          {label}
        </Collapsible.Trigger>
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible>
    );
  }

  return (
    <div
      ref={ref}
      role={label ? 'group' : undefined}
      aria-labelledby={label ? labelId : undefined}
      data-slot="sidebar-group"
      className={cn('flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    >
      {label ? <SidebarGroupLabel id={labelId}>{label}</SidebarGroupLabel> : null}
      {children}
    </div>
  );
};
SidebarGroup.displayName = 'SidebarGroup';

const SidebarMenu = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLUListElement> & { ref?: React.Ref<HTMLUListElement> }) => (
  <ul
    ref={ref}
    data-slot="sidebar-menu"
    className={cn('flex w-full min-w-0 flex-col gap-0.5', className)}
    {...props}
  />
);
SidebarMenu.displayName = 'SidebarMenu';

interface SidebarItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  children?: React.ReactNode;
  href?: string;
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  tooltip?: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
}

type SlotChild = React.ReactElement<
  Record<string, unknown> & {
    children?: React.ReactNode;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  }
>;

const SidebarItem = ({
  children,
  href,
  active = false,
  icon,
  badge,
  tooltip,
  disabled,
  asChild = false,
  className,
  onClick,
  ref,
  ...props
}: SidebarItemProps & { ref?: React.Ref<HTMLElement> }) => {
  const { iconOnly, mobile, side } = React.use(SidebarSurfaceContext);
  const { setOpenMobile, dir } = useSidebarInternal();
  const slot = asChild && React.isValidElement(children) ? (children as SlotChild) : null;
  const label = slot ? slot.props.children : children;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    slot?.props.onClick?.(event);
    onClick?.(event);
    if (mobile && !event.defaultPrevented) setOpenMobile(false);
  };

  const content = (
    <>
      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
        >
          {icon}
        </span>
      ) : null}
      <span
        data-slot="sidebar-menu-label"
        className={cn('min-w-0 flex-1 truncate text-start', iconOnly && 'sr-only')}
      >
        {label}
      </span>
      {badge != null && !iconOnly ? ' ' : null}
      {badge != null && !iconOnly ? (
        <span
          data-slot="sidebar-menu-badge"
          className="text-muted-foreground ms-auto shrink-0 text-xs tabular-nums"
        >
          {badge}
        </span>
      ) : null}
    </>
  );

  const shared = {
    ...props,
    ref,
    'data-slot': 'sidebar-menu-button',
    'data-state': active ? 'active' : 'inactive',
    'data-active': active ? '' : undefined,
    'aria-current': active ? ('page' as const) : undefined,
    onClick: handleClick,
    className: cn(
      'text-muted-strong hover:bg-muted hover:text-foreground focus-visible:ring-ring flex h-8 w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset',
      'aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:pointer-events-none disabled:opacity-40',
      active && 'bg-muted text-foreground font-medium',
      iconOnly && 'size-8 justify-center gap-0 px-0',
      slot?.props.className,
      className,
    ),
  };

  let element: React.ReactElement;
  if (slot) {
    element = React.cloneElement(slot, { ...shared, children: content });
  } else if (href !== undefined) {
    element = (
      <a
        {...shared}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
      >
        {content}
      </a>
    );
  } else {
    element = (
      <button
        type="button"
        {...shared}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  if (iconOnly) {
    const towardsRight = (side === 'start') === (dir === 'ltr');
    element = (
      <Tooltip>
        <Tooltip.Trigger asChild>{element}</Tooltip.Trigger>
        <Tooltip.Content side={towardsRight ? 'right' : 'left'}>{tooltip ?? label}</Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn('relative min-w-0', iconOnly && 'flex justify-center')}
    >
      {element}
    </li>
  );
};
SidebarItem.displayName = 'SidebarItem';

const SidebarSeparator = ({ className, ref, ...props }: SidebarSectionProps) => (
  <div
    ref={ref}
    role="separator"
    data-slot="sidebar-separator"
    className={cn('bg-border mx-4 h-px shrink-0', className)}
    {...props}
  />
);
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarTrigger = ({
  className,
  onClick,
  children,
  'aria-label': ariaLabel = 'Toggle sidebar',
  ...props
}: ButtonProps) => {
  const { open, openMobile, isMobile, toggleSidebar, sidebarId, mobileId } = useSidebarInternal();
  const expanded = isMobile ? openMobile : open;

  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      aria-expanded={expanded}
      aria-controls={isMobile ? mobileId : sidebarId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleSidebar();
      }}
      className={cn('text-muted-foreground hover:text-foreground size-8', className)}
      {...props}
    >
      {children ?? <PanelStartIcon size={16} className="size-4 rtl:-scale-x-100" />}
    </Button>
  );
};
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = ({
  className,
  onClick,
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { toggleSidebar } = useSidebarInternal();
  const { side, mobile, collapsible } = React.use(SidebarSurfaceContext);
  if (mobile || collapsible === 'none') return null;

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      data-slot="sidebar-rail"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleSidebar();
      }}
      className={cn(
        'after:bg-border-interactive absolute inset-y-0 z-20 w-4 cursor-ew-resize after:absolute after:inset-y-0 after:start-1/2 after:w-px after:opacity-0 after:transition-opacity hover:after:opacity-100',
        side === 'start' ? '-end-2' : '-start-2',
        className,
      )}
      {...props}
    />
  );
};
SidebarRail.displayName = 'SidebarRail';

interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'main' | 'div' | 'section';
}

const SidebarInset = ({
  as: Element = 'main',
  className,
  ref,
  ...props
}: SidebarInsetProps & { ref?: React.Ref<HTMLElement> }) => (
  <Element
    ref={ref as React.Ref<HTMLDivElement>}
    data-slot="sidebar-inset"
    className={cn(
      'bg-background relative flex min-w-0 flex-1 flex-col',
      'group-has-[>[data-slot=sidebar][data-variant=inset]]/sidebar-wrapper:border-border group-has-[>[data-slot=sidebar][data-variant=inset]]/sidebar-wrapper:m-2 group-has-[>[data-slot=sidebar][data-variant=inset]]/sidebar-wrapper:rounded-lg group-has-[>[data-slot=sidebar][data-variant=inset]]/sidebar-wrapper:border',
      className,
    )}
    {...props}
  />
);
SidebarInset.displayName = 'SidebarInset';

const Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Menu: SidebarMenu,
  Item: SidebarItem,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  Inset: SidebarInset,
  Rail: SidebarRail,
});

export { Sidebar, useSidebar };
export type {
  SidebarCollapsible,
  SidebarContextValue,
  SidebarGroupProps,
  SidebarInsetProps,
  SidebarItemProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarSide,
  SidebarState,
  SidebarVariant,
};
