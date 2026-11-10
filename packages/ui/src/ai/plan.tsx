'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { collapse, springs, still } from '../lib/motion';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function Svg({ size = 24, strokeWidth = 1.5, children, ...props }: IconProps) {
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

function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

function LoaderIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </Svg>
  );
}

function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </Svg>
  );
}

function CircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
    </Svg>
  );
}

function SkipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
    </Svg>
  );
}

const INSTANT_COLLAPSE: Variants = {
  closed: { height: 0, opacity: 0, transition: still },
  open: { height: 'auto', opacity: 1, transition: still },
};

type PlanStepStatus = 'pending' | 'active' | 'complete' | 'skipped' | 'error';

type PlanStepStatusLabels = Record<PlanStepStatus, string>;

const DEFAULT_STATUS_LABELS: PlanStepStatusLabels = {
  pending: 'Pending',
  active: 'In progress',
  complete: 'Done',
  skipped: 'Skipped',
  error: 'Failed',
};

const STATUS_ICON: Record<PlanStepStatus, React.ComponentType<IconProps>> = {
  pending: CircleIcon,
  active: LoaderIcon,
  complete: CheckIcon,
  skipped: SkipIcon,
  error: AlertIcon,
};

const STATUS_TONE: Record<PlanStepStatus, string> = {
  pending: 'text-border-interactive',
  active: 'text-foreground',
  complete: 'text-success-text',
  skipped: 'text-muted-foreground',
  error: 'text-destructive-text',
};

interface PlanContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const PlanContext = React.createContext<PlanContextValue | null>(null);

const usePlanContext = (): PlanContextValue => {
  const context = React.use(PlanContext);
  if (!context) {
    throw new Error('Plan components must be used within Plan');
  }
  return context;
};

interface PlanProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PlanHeaderProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title: React.ReactNode;
  completed?: number;
  total?: number;
  progressLabel?: (completed: number, total: number) => string;
}

type PlanContentProps = React.HTMLAttributes<HTMLOListElement>;

interface PlanStepProps extends React.LiHTMLAttributes<HTMLLIElement> {
  status?: PlanStepStatus;
  description?: React.ReactNode;
  statusLabels?: Partial<PlanStepStatusLabels>;
}

const PlanRoot = ({
  className,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  children,
  ref,
  ...props
}: PlanProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();

  const value = React.useMemo<PlanContextValue>(() => ({ open, setOpen, id }), [open, setOpen, id]);

  return (
    <PlanContext value={value}>
      <div
        ref={ref}
        data-slot="plan"
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'border-border bg-card text-card-foreground w-full overflow-hidden rounded-lg border',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </PlanContext>
  );
};

PlanRoot.displayName = 'Plan';

const PlanHeader = ({
  className,
  title,
  completed,
  total,
  progressLabel = (done, all) => `${done} of ${all} done`,
  children,
  onClick,
  ref,
  ...props
}: PlanHeaderProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id } = usePlanContext();
  const shouldReduceMotion = useReducedMotion();
  const hasProgress = typeof completed === 'number' && typeof total === 'number' && total > 0;
  const ratio = hasProgress ? Math.min(Math.max(completed / total, 0), 1) : 0;

  return (
    <button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      data-slot="plan-header"
      aria-expanded={open}
      aria-controls={open ? `${id}-content` : undefined}
      onClick={(event) => {
        setOpen(!open);
        onClick?.(event);
      }}
      className={cn(
        'bg-surface-muted hover:bg-muted/60 focus-visible:ring-ring relative flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        open && 'border-border border-b',
        className,
      )}
      {...props}
    >
      <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
      {children}
      {hasProgress ? (
        <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
          <span aria-hidden="true">{`${completed}/${total}`}</span>
          <span className="sr-only">{progressLabel(completed, total)}</span>
        </span>
      ) : null}
      <motion.span
        aria-hidden="true"
        className="text-muted-foreground flex shrink-0"
        animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
        transition={springs.snappy}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
      {hasProgress ? (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
          <span
            data-slot="plan-progress"
            className="bg-foreground/60 block h-full transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${ratio * 100}%` }}
          />
        </span>
      ) : null}
    </button>
  );
};

PlanHeader.displayName = 'PlanHeader';

const PlanContent = ({
  className,
  children,
  ref,
  ...props
}: PlanContentProps & { ref?: React.Ref<HTMLOListElement> }) => {
  const { open, id } = usePlanContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={shouldReduceMotion ? INSTANT_COLLAPSE : collapse}
          initial="closed"
          animate="open"
          exit="closed"
          className="overflow-hidden"
        >
          <ol
            ref={ref}
            data-slot="plan-content"
            className={cn('flex flex-col gap-2.5 px-3 py-3', className)}
            {...props}
          >
            {children}
          </ol>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

PlanContent.displayName = 'PlanContent';

const PlanStep = ({
  className,
  status = 'pending',
  description,
  statusLabels,
  children,
  ref,
  ...props
}: PlanStepProps & { ref?: React.Ref<HTMLLIElement> }) => {
  const StatusIcon = STATUS_ICON[status];
  const statusLabel = statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status];

  return (
    <li
      ref={ref}
      data-slot="plan-step"
      data-status={status}
      aria-current={status === 'active' ? 'step' : undefined}
      className={cn('flex gap-2.5 text-sm', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-4 shrink-0 items-center justify-center',
          STATUS_TONE[status],
          status === 'active' && 'motion-safe:animate-spin',
        )}
      >
        <StatusIcon size={14} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            status === 'active' ? 'text-foreground font-medium' : 'text-muted-foreground',
            status === 'skipped' && 'line-through',
          )}
        >
          {children}
          <span className="sr-only">{`, ${statusLabel}`}</span>
        </span>
        {description ? (
          <span className="text-muted-foreground text-xs leading-relaxed">{description}</span>
        ) : null}
      </span>
    </li>
  );
};

PlanStep.displayName = 'PlanStep';

const Plan = Object.assign(PlanRoot, {
  Header: PlanHeader,
  Content: PlanContent,
  Step: PlanStep,
});

export { Plan };
export type {
  PlanContentProps,
  PlanHeaderProps,
  PlanProps,
  PlanStepProps,
  PlanStepStatus,
  PlanStepStatusLabels,
};
