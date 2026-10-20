'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { springs, still } from '../lib/motion';
import { useControllableState } from '../lib/use-controllable-state';

const tabsListVariants = cva(
  'inline-flex max-w-full rounded-md p-0.5 text-muted-foreground w-full sm:w-auto overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  {
    variants: {
      variant: {
        default: 'bg-muted/60 border border-border/40',
        outline: 'border border-border bg-transparent',
        underline: 'bg-transparent border-b border-border rounded-none p-0 justify-start w-full',
        ghost: 'bg-transparent p-0 gap-1',
        unstyled: '',
      },
      size: {
        default: 'h-9',
        sm: 'h-8',
        lg: 'h-11',
      },
    },
  },
);

const tabsTriggerVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 z-10 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground data-[state=active]:text-foreground',
        outline: 'text-muted-foreground data-[state=active]:text-foreground',
        underline:
          'text-muted-foreground hover:text-foreground data-[state=active]:text-foreground rounded-none bg-transparent px-4 pb-3 pt-2',
        ghost:
          'text-muted-foreground hover:text-foreground data-[state=active]:text-foreground hover:bg-muted/50 rounded-md',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type TabsOrientation = 'horizontal' | 'vertical';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: NonNullable<TabsProps['variant']>;
  size: NonNullable<TabsProps['size']>;
  layoutId: string;
  mountedPanels: ReadonlySet<string>;
  registerPanel: (value: string) => () => void;
}

interface TabsListContextValue {
  orientation: TabsOrientation;
  fallbackTab: string | null;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);
const TabsListContext = React.createContext<TabsListContextValue>({
  orientation: 'horizontal',
  fallbackTab: null,
});

function useTabsContext() {
  const context = React.use(TabsContext);
  if (!context) throw new Error('Tabs components must be used within Tabs');
  return context;
}

function toDomId(value: string) {
  return value.replace(
    /[^A-Za-z0-9-]/g,
    (char) => `_${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
}

function getTriggers(list: Element) {
  return Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
    (trigger) => trigger.closest('[role="tablist"]') === list,
  );
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'outline' | 'underline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const TabsRoot = ({
  className,
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = 'default',
  size = 'default',
  children,
  ref,
  ...props
}: TabsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [activeTab, setActiveTab] = useControllableState({
    value: controlledValue,
    defaultValue: defaultValue || '',
    onChange: onValueChange,
  });
  const layoutId = React.useId();
  const [mountedPanels, setMountedPanels] = React.useState<ReadonlySet<string>>(() => new Set());

  const registerPanel = React.useCallback((value: string) => {
    setMountedPanels((previous) => (previous.has(value) ? previous : new Set(previous).add(value)));
    return () => {
      setMountedPanels((previous) => {
        if (!previous.has(value)) return previous;
        const next = new Set(previous);
        next.delete(value);
        return next;
      });
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({ activeTab, setActiveTab, variant, size, layoutId, mountedPanels, registerPanel }),
    [activeTab, setActiveTab, variant, size, layoutId, mountedPanels, registerPanel],
  );

  return (
    <TabsContext value={contextValue}>
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext>
  );
};
TabsRoot.displayName = 'Tabs';

interface TabsListProps
  extends
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
    >,
    VariantProps<typeof tabsListVariants> {
  orientation?: TabsOrientation;
}

const TabsList = ({
  className,
  variant,
  size,
  orientation = 'horizontal',
  children,
  ref,
  ...props
}: TabsListProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { activeTab, variant: contextVariant, size: contextSize } = useTabsContext();
  const finalVariant = variant || contextVariant;
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [fallbackTab, setFallbackTab] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const enabled = getTriggers(list).filter((trigger) => !trigger.disabled);
    const hasActive = enabled.some((trigger) => trigger.getAttribute('aria-selected') === 'true');
    setFallbackTab(hasActive ? null : (enabled[0]?.dataset.value ?? null));
  }, [activeTab, children]);

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const listContext = React.useMemo(
    () => ({ orientation, fallbackTab }),
    [orientation, fallbackTab],
  );

  return (
    <TabsListContext value={listContext}>
      <motion.div
        ref={mergedRef}
        role="tablist"
        aria-orientation={orientation}
        layoutScroll
        className={cn(
          tabsListVariants({ variant: finalVariant, size: size || contextSize }),
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    </TabsListContext>
  );
};
TabsList.displayName = 'TabsList';

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof tabsTriggerVariants> {
  value: string;
  children: React.ReactNode;
}

const TabsTrigger = ({
  className,
  value,
  children,
  variant,
  size,
  onClick,
  onKeyDown,
  ref,
  ...props
}: TabsTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const {
    activeTab,
    setActiveTab,
    variant: contextVariant,
    size: contextSize,
    layoutId,
    mountedPanels,
  } = useTabsContext();
  const { orientation, fallbackTab } = React.use(TabsListContext);
  const isActive = activeTab === value;
  const finalVariant = variant || contextVariant;
  const finalSize = size || contextSize;
  const shouldReduceMotion = useReducedMotion();
  const domValue = toDomId(value);
  const hasPanel = isActive || mountedPanels.has(value);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    setActiveTab(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const current = e.currentTarget;
    const list = current.closest('[role="tablist"]');
    if (!list) return;

    const triggers = getTriggers(list).filter((trigger) => !trigger.disabled);
    const currentIndex = triggers.indexOf(current);
    if (currentIndex === -1) return;

    const isRtl = orientation === 'horizontal' && getComputedStyle(list).direction === 'rtl';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : isRtl ? 'ArrowLeft' : 'ArrowRight';
    const previousKey = orientation === 'vertical' ? 'ArrowUp' : isRtl ? 'ArrowRight' : 'ArrowLeft';

    let newIndex: number;
    if (e.key === nextKey) {
      newIndex = (currentIndex + 1) % triggers.length;
    } else if (e.key === previousKey) {
      newIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = triggers.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    if (newIndex !== currentIndex) {
      triggers[newIndex]?.focus();
      triggers[newIndex]?.click();
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${layoutId}-trigger-${domValue}`}
      aria-selected={isActive}
      aria-controls={hasPanel ? `${layoutId}-content-${domValue}` : undefined}
      tabIndex={isActive || fallbackTab === value ? 0 : -1}
      data-state={isActive ? 'active' : 'inactive'}
      data-value={value}
      className={cn(tabsTriggerVariants({ variant: finalVariant, size: finalSize }), className)}
      {...props}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="inherit relative z-20">{children}</span>
      {isActive && (
        <motion.div
          layoutId={`${layoutId}-indicator`}
          className={cn(
            'absolute inset-0 z-10',
            finalVariant === 'underline'
              ? 'bg-foreground top-auto bottom-0 h-[1.5px]'
              : 'bg-background dark:bg-input border-border/30 rounded-sm border shadow-sm',
          )}
          transition={shouldReduceMotion ? still : springs.smooth}
        />
      )}
    </button>
  );
};
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

const TabsContent = ({
  className,
  value,
  forceMount = false,
  children,
  ref,
  ...props
}: TabsContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { activeTab, layoutId, registerPanel } = useTabsContext();
  const isActive = activeTab === value;
  const domValue = toDomId(value);

  React.useLayoutEffect(() => {
    if (!forceMount) return;
    return registerPanel(value);
  }, [forceMount, registerPanel, value]);

  if (!isActive && !forceMount) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${layoutId}-content-${domValue}`}
      aria-labelledby={`${layoutId}-trigger-${domValue}`}
      tabIndex={0}
      hidden={!isActive}
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        'ring-offset-background focus-visible:ring-ring mt-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TabsContent.displayName = 'TabsContent';

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs };
