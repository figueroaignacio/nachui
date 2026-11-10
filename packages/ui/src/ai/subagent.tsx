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

function BranchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M6 7v12" />
      <path d="M6 12h4a4 4 0 0 0 4-4V7" />
      <path d="M14 12h2" />
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

function StopIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9h6v6H9z" />
    </Svg>
  );
}

const INSTANT_COLLAPSE: Variants = {
  closed: { height: 0, opacity: 0, transition: still },
  open: { height: 'auto', opacity: 1, transition: still },
};

type SubagentStatus = 'pending' | 'running' | 'complete' | 'error' | 'stopped';

type SubagentStatusLabels = Record<SubagentStatus, string>;

const DEFAULT_STATUS_LABELS: SubagentStatusLabels = {
  pending: 'Queued',
  running: 'Running',
  complete: 'Done',
  error: 'Failed',
  stopped: 'Stopped',
};

const STATUS_ICON: Record<SubagentStatus, React.ComponentType<IconProps>> = {
  pending: DotIcon,
  running: LoaderIcon,
  complete: CheckIcon,
  error: AlertIcon,
  stopped: StopIcon,
};

const STATUS_TONE: Record<SubagentStatus, string> = {
  pending: 'text-muted-foreground',
  running: 'text-foreground',
  complete: 'text-success-text',
  error: 'text-destructive-text',
  stopped: 'text-muted-foreground',
};

interface SubagentContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  status: SubagentStatus;
  id: string;
}

const SubagentContext = React.createContext<SubagentContextValue | null>(null);

const useSubagentContext = (): SubagentContextValue => {
  const context = React.use(SubagentContext);
  if (!context) {
    throw new Error('Subagent components must be used within Subagent');
  }
  return context;
};

interface SubagentProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: SubagentStatus;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SubagentHeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  task?: React.ReactNode;
  meta?: React.ReactNode;
  statusLabels?: Partial<SubagentStatusLabels>;
}

type SubagentContentProps = React.HTMLAttributes<HTMLDivElement>;

interface SubagentResultProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const SubagentRoot = ({
  className,
  status = 'complete',
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  children,
  ref,
  ...props
}: SubagentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen ?? status === 'running',
    onChange: onOpenChange,
  });
  const id = React.useId();

  const value = React.useMemo<SubagentContextValue>(
    () => ({ open, setOpen, status, id }),
    [open, setOpen, status, id],
  );

  return (
    <SubagentContext value={value}>
      <div
        ref={ref}
        data-slot="subagent"
        data-state={open ? 'open' : 'closed'}
        data-status={status}
        className={cn('flex w-full min-w-0 flex-col', className)}
        {...props}
      >
        {children}
      </div>
    </SubagentContext>
  );
};

SubagentRoot.displayName = 'Subagent';

const SubagentHeader = ({
  className,
  name,
  task,
  meta,
  statusLabels,
  onClick,
  ref,
  ...props
}: SubagentHeaderProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, status, id } = useSubagentContext();
  const shouldReduceMotion = useReducedMotion();
  const StatusIcon = STATUS_ICON[status];
  const statusLabel = statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status];

  return (
    <button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      data-slot="subagent-header"
      aria-expanded={open}
      aria-controls={open ? `${id}-content` : undefined}
      onClick={(event) => {
        setOpen(!open);
        onClick?.(event);
      }}
      className={cn(
        'border-border bg-card hover:bg-muted/60 focus-visible:ring-ring flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-start transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="bg-surface-muted text-muted-strong flex size-7 shrink-0 items-center justify-center rounded-md"
      >
        <BranchIcon size={14} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-foreground truncate font-mono text-xs">{name}</span>
        {task ? <span className="text-muted-foreground truncate text-xs">{task}</span> : null}
      </span>
      {meta ? (
        <span className="text-muted-foreground hidden shrink-0 font-mono text-xs tabular-nums sm:inline">
          {meta}
        </span>
      ) : null}
      <span className={cn('flex shrink-0 items-center', STATUS_TONE[status])}>
        <span
          aria-hidden="true"
          className={cn('flex', status === 'running' && 'motion-safe:animate-spin')}
        >
          <StatusIcon size={14} />
        </span>
        <span className="sr-only">{statusLabel}</span>
      </span>
      <motion.span
        aria-hidden="true"
        className="text-muted-foreground flex shrink-0"
        animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
        transition={springs.snappy}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
    </button>
  );
};

SubagentHeader.displayName = 'SubagentHeader';

const SubagentContent = ({
  className,
  children,
  ref,
  ...props
}: SubagentContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open, id } = useSubagentContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={shouldReduceMotion ? INSTANT_COLLAPSE : collapse}
          initial="closed"
          animate="open"
          exit="closed"
          className="overflow-hidden"
        >
          <div
            data-slot="subagent-content"
            className={cn(
              'border-border ms-[26px] flex flex-col gap-2 border-s ps-3 pt-2 sm:ps-4',
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SubagentContent.displayName = 'SubagentContent';

const SubagentResult = ({
  className,
  label = 'Returned',
  children,
  ref,
  ...props
}: SubagentResultProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-slot="subagent-result"
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      <span className="text-muted-foreground font-mono text-[11px]">{label}</span>
      <div className="bg-surface-muted text-foreground rounded-md px-3 py-2 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

SubagentResult.displayName = 'SubagentResult';

const Subagent = Object.assign(SubagentRoot, {
  Header: SubagentHeader,
  Content: SubagentContent,
  Result: SubagentResult,
});

export { Subagent };
export type {
  SubagentContentProps,
  SubagentHeaderProps,
  SubagentProps,
  SubagentResultProps,
  SubagentStatus,
  SubagentStatusLabels,
};
