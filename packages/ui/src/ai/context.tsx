'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

const PANEL_TRANSITION = { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 } as const;
const PANEL_INITIAL = { opacity: 0, y: 6, scale: 0.98 } as const;
const PANEL_ANIMATE = { opacity: 1, y: 0, scale: 1 } as const;
const PANEL_EXIT = { opacity: 0, y: 4, scale: 0.98 } as const;
const REDUCED_INITIAL = { opacity: 0 } as const;
const REDUCED_ANIMATE = { opacity: 1 } as const;

const RADIUS = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTokens(tokens: number): string {
  if (tokens < 1000) return String(tokens);
  if (tokens < 1_000_000) return `${(tokens / 1000).toFixed(tokens < 10_000 ? 1 : 0)}K`;
  return `${(tokens / 1_000_000).toFixed(1)}M`;
}

interface ContextContextValue {
  maxTokens: number;
  usedTokens: number;
  percent: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const ContextContext = React.createContext<ContextContextValue | null>(null);

const useContextMeter = (): ContextContextValue => {
  const context = React.use(ContextContext);
  if (!context) {
    throw new Error('Context components must be used within Context');
  }
  return context;
};

interface ContextProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTokens: number;
  usedTokens: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ContextTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type MotionSafeProps<T> = Omit<
  React.HTMLAttributes<T>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

interface ContextContentProps extends MotionSafeProps<HTMLDivElement> {
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
}

type ContextHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type ContextBodyProps = React.HTMLAttributes<HTMLDivElement>;
type ContextFooterProps = React.HTMLAttributes<HTMLDivElement>;

interface ContextUsageProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  tokens?: number;
  tone?: 'default' | 'muted' | 'success' | 'info' | 'warning';
}

const TONE_DOT: Record<NonNullable<ContextUsageProps['tone']>, string> = {
  default: 'bg-foreground',
  muted: 'bg-muted-foreground',
  success: 'bg-success',
  info: 'bg-info',
  warning: 'bg-warning',
};

const ContextRoot = ({
  className,
  maxTokens,
  usedTokens,
  open: controlledOpen,
  onOpenChange,
  children,
  ref,
  ...props
}: ContextProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const id = React.useId();

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const safeMax = maxTokens > 0 ? maxTokens : 1;
  const percent = Math.min(Math.max(usedTokens / safeMax, 0), 1);

  const value = React.useMemo<ContextContextValue>(
    () => ({ maxTokens, usedTokens, percent, open, setOpen, id }),
    [maxTokens, usedTokens, percent, open, setOpen, id],
  );

  return (
    <ContextContext value={value}>
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
        className={cn('relative inline-flex', className)}
        {...props}
      >
        {children}
      </div>
    </ContextContext>
  );
};

ContextRoot.displayName = 'Context';

const ContextTrigger = ({
  className,
  children,
  ref,
  ...props
}: ContextTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { percent, open, setOpen, id, usedTokens, maxTokens } = useContextMeter();
  const rounded = Math.round(percent * 100);

  return (
    <button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      aria-expanded={open}
      aria-controls={`${id}-content`}
      aria-label={`${formatTokens(usedTokens)} of ${formatTokens(maxTokens)} tokens used`}
      onClick={() => setOpen(!open)}
      className={cn(
        'border-border bg-background text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex h-8 items-center gap-1.5 rounded-full border pr-2.5 pl-1.5 text-xs tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
            <circle cx="9" cy="9" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="2.5" />
            <circle
              cx="9"
              cy="9"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percent)}
              transform="rotate(-90 9 9)"
            />
          </svg>
          <span>{rounded}%</span>
        </>
      )}
    </button>
  );
};

ContextTrigger.displayName = 'ContextTrigger';

const ContextContent = ({
  className,
  side = 'bottom',
  align = 'start',
  children,
  ref,
  ...props
}: ContextContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open, id } = useContextMeter();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="dialog"
          aria-labelledby={`${id}-trigger`}
          initial={shouldReduceMotion ? REDUCED_INITIAL : PANEL_INITIAL}
          animate={shouldReduceMotion ? REDUCED_ANIMATE : PANEL_ANIMATE}
          exit={shouldReduceMotion ? REDUCED_INITIAL : PANEL_EXIT}
          transition={shouldReduceMotion ? { duration: 0.1 } : PANEL_TRANSITION}
          className={cn(
            'border-border bg-popover text-popover-foreground absolute z-50 w-64 rounded-lg border p-3 shadow-[var(--elevation-md)]',
            side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
            align === 'start' && 'left-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'end' && 'right-0',
            className,
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ContextContent.displayName = 'ContextContent';

const ContextHeader = ({
  className,
  children,
  ref,
  ...props
}: ContextHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { usedTokens, maxTokens, percent } = useContextMeter();

  return (
    <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
      {children ?? (
        <>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-foreground text-xs font-medium">
              {Math.round(percent * 100)}% of context used
            </span>
            <span className="text-muted-foreground text-[11px] tabular-nums">
              {formatTokens(usedTokens)} / {formatTokens(maxTokens)}
            </span>
          </div>
          <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
            <div
              className="bg-foreground h-full rounded-full"
              style={{ width: `${percent * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
};

ContextHeader.displayName = 'ContextHeader';

const ContextBody = ({
  className,
  ref,
  ...props
}: ContextBodyProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('mt-3 flex flex-col gap-1.5', className)} {...props} />;
};

ContextBody.displayName = 'ContextBody';

const ContextFooter = ({
  className,
  ref,
  ...props
}: ContextFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-border text-muted-foreground mt-3 border-t pt-2 text-[11px]',
        className,
      )}
      {...props}
    />
  );
};

ContextFooter.displayName = 'ContextFooter';

const ContextUsage = ({
  className,
  label,
  tokens,
  tone = 'default',
  children,
  ref,
  ...props
}: ContextUsageProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-2 text-xs', className)}
      {...props}
    >
      {children ?? (
        <>
          <span className="text-muted-foreground flex min-w-0 items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn('size-1.5 shrink-0 rounded-full', TONE_DOT[tone])}
            />
            <span className="truncate">{label}</span>
          </span>
          {tokens !== undefined && (
            <span className="text-foreground shrink-0 tabular-nums">{formatTokens(tokens)}</span>
          )}
        </>
      )}
    </div>
  );
};

ContextUsage.displayName = 'ContextUsage';

const Context = Object.assign(ContextRoot, {
  Trigger: ContextTrigger,
  Content: ContextContent,
  Header: ContextHeader,
  Body: ContextBody,
  Footer: ContextFooter,
  Usage: ContextUsage,
});

export { Context, formatTokens, useContextMeter };
export type {
  ContextBodyProps,
  ContextContentProps,
  ContextFooterProps,
  ContextHeaderProps,
  ContextProps,
  ContextTriggerProps,
  ContextUsageProps,
};
