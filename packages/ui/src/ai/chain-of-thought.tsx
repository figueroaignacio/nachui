'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronDownIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function RouteIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="5" r="3" />
      <path d="M9 19h5a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h5" />
    </svg>
  );
}

function DotIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const CHAIN_CONTENT_VARIANTS = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number],
      },
      opacity: { duration: 0.2, delay: 0.04 },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] },
      opacity: { duration: 0.12 },
    },
  },
} as const;

const PULSE_ANIMATE = { opacity: [0.45, 1, 0.45] };
const PULSE_TRANSITION = { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } as const;
const CHEVRON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;

type ChainOfThoughtStatus = 'complete' | 'active' | 'pending';

interface ChainOfThoughtContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const ChainOfThoughtContext = React.createContext<ChainOfThoughtContextValue | null>(null);

const useChainOfThoughtContext = (): ChainOfThoughtContextValue => {
  const context = React.use(ChainOfThoughtContext);
  if (!context) {
    throw new Error('ChainOfThought components must be used within ChainOfThought');
  }
  return context;
};

interface ChainOfThoughtProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ChainOfThoughtHeaderProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type ChainOfThoughtContentProps = React.HTMLAttributes<HTMLDivElement>;

interface ChainOfThoughtStepProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentType<IconProps>;
  label: React.ReactNode;
  description?: React.ReactNode;
  status?: ChainOfThoughtStatus;
}

type ChainOfThoughtSearchResultsProps = React.HTMLAttributes<HTMLDivElement>;
type ChainOfThoughtSearchResultProps = React.HTMLAttributes<HTMLSpanElement>;

interface ChainOfThoughtImageProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: React.ReactNode;
}

const STATUS_TONE: Record<ChainOfThoughtStatus, string> = {
  complete: 'text-foreground',
  active: 'text-foreground',
  pending: 'text-muted-foreground',
};

const ChainOfThoughtRoot = ({
  className,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  ref,
  ...props
}: ChainOfThoughtProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
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

  const value = React.useMemo<ChainOfThoughtContextValue>(
    () => ({ open, setOpen, id }),
    [open, setOpen, id],
  );

  return (
    <ChainOfThoughtContext value={value}>
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn('flex w-full flex-col gap-1', className)}
        {...props}
      >
        {children}
      </div>
    </ChainOfThoughtContext>
  );
};

ChainOfThoughtRoot.displayName = 'ChainOfThought';

const ChainOfThoughtHeader = ({
  className,
  children = 'Chain of Thought',
  onClick,
  ref,
  ...props
}: ChainOfThoughtHeaderProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id } = useChainOfThoughtContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      aria-expanded={open}
      aria-controls={`${id}-content`}
      onClick={(event) => {
        setOpen(!open);
        onClick?.(event);
      }}
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring flex w-full items-center gap-2 rounded-md text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <RouteIcon size={15} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <motion.span
        aria-hidden="true"
        className="flex shrink-0"
        animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
        transition={CHEVRON_TRANSITION}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
    </button>
  );
};

ChainOfThoughtHeader.displayName = 'ChainOfThoughtHeader';

const ChainOfThoughtContent = ({
  className,
  children,
  ref,
  ...props
}: ChainOfThoughtContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open, id } = useChainOfThoughtContext();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={CHAIN_CONTENT_VARIANTS}
          initial="closed"
          animate="open"
          exit="closed"
          className="overflow-hidden"
        >
          <div className={cn('flex flex-col gap-3 pt-2', className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ChainOfThoughtContent.displayName = 'ChainOfThoughtContent';

const ChainOfThoughtStep = ({
  className,
  icon: Icon = DotIcon,
  label,
  description,
  status = 'complete',
  children,
  ref,
  ...props
}: ChainOfThoughtStepProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const shouldReduceMotion = useReducedMotion();

  const indicator = (
    <span
      aria-hidden="true"
      className={cn(
        'border-border bg-background text-muted-foreground relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border',
        status === 'complete' && 'text-foreground',
      )}
    >
      <Icon size={12} />
    </span>
  );

  return (
    <div
      ref={ref}
      data-status={status}
      className={cn(
        'group/step relative flex gap-3 text-sm',
        'before:bg-border before:absolute before:top-5 before:bottom-[-0.75rem] before:left-[9px] before:w-px before:content-[""]',
        'last:before:hidden',
        className,
      )}
      {...props}
    >
      {status === 'active' && !shouldReduceMotion ? (
        <motion.span className="contents" animate={PULSE_ANIMATE} transition={PULSE_TRANSITION}>
          {indicator}
        </motion.span>
      ) : (
        indicator
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-1">
        <span className={cn('leading-tight font-medium', STATUS_TONE[status])}>{label}</span>
        {description && (
          <span className="text-muted-foreground text-xs leading-relaxed">{description}</span>
        )}
        {children}
      </div>
    </div>
  );
};

ChainOfThoughtStep.displayName = 'ChainOfThoughtStep';

const ChainOfThoughtSearchResults = ({
  className,
  ref,
  ...props
}: ChainOfThoughtSearchResultsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex flex-wrap gap-1.5', className)} {...props} />;
};

ChainOfThoughtSearchResults.displayName = 'ChainOfThoughtSearchResults';

const ChainOfThoughtSearchResult = ({
  className,
  ref,
  ...props
}: ChainOfThoughtSearchResultProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  return (
    <span
      ref={ref}
      className={cn(
        'border-border bg-secondary text-secondary-foreground inline-flex max-w-full items-center gap-1 truncate rounded-sm border px-1.5 py-0.5 text-[11px] [&>svg]:size-3 [&>svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
};

ChainOfThoughtSearchResult.displayName = 'ChainOfThoughtSearchResult';

const ChainOfThoughtImage = ({
  className,
  caption,
  children,
  ref,
  ...props
}: ChainOfThoughtImageProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
      <div className="border-border bg-muted/40 overflow-hidden rounded-md border p-2">
        {children}
      </div>
      {caption && <span className="text-muted-foreground text-xs">{caption}</span>}
    </div>
  );
};

ChainOfThoughtImage.displayName = 'ChainOfThoughtImage';

const ChainOfThought = Object.assign(ChainOfThoughtRoot, {
  Header: ChainOfThoughtHeader,
  Content: ChainOfThoughtContent,
  Step: ChainOfThoughtStep,
  SearchResults: ChainOfThoughtSearchResults,
  SearchResult: ChainOfThoughtSearchResult,
  Image: ChainOfThoughtImage,
});

export { ChainOfThought };
export type {
  ChainOfThoughtContentProps,
  ChainOfThoughtHeaderProps,
  ChainOfThoughtImageProps,
  ChainOfThoughtProps,
  ChainOfThoughtSearchResultProps,
  ChainOfThoughtSearchResultsProps,
  ChainOfThoughtStatus,
  ChainOfThoughtStepProps,
};
