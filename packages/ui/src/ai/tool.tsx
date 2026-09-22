'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function WrenchIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

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

function LoaderIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

function AlertIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
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

const TOOL_CONTENT_VARIANTS = {
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

const SPIN_ANIMATE = { rotate: 360 };
const SPIN_TRANSITION = { repeat: Infinity, duration: 1, ease: 'linear' } as const;
const CHEVRON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;

type ToolStatus = 'pending' | 'running' | 'complete' | 'error';

type ToolStatusLabels = Record<ToolStatus, string>;

const DEFAULT_STATUS_LABELS: ToolStatusLabels = {
  pending: 'Pending',
  running: 'Running',
  complete: 'Completed',
  error: 'Failed',
};

const STATUS_ICON: Record<ToolStatus, React.ComponentType<IconProps>> = {
  pending: DotIcon,
  running: LoaderIcon,
  complete: CheckIcon,
  error: AlertIcon,
};

const STATUS_TONE: Record<ToolStatus, string> = {
  pending: 'text-muted-foreground',
  running: 'text-foreground',
  complete: 'text-success-text',
  error: 'text-destructive-text',
};

interface ToolContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  status: ToolStatus;
  id: string;
}

const ToolContext = React.createContext<ToolContextValue | null>(null);

const useToolContext = (): ToolContextValue => {
  const context = React.use(ToolContext);
  if (!context) {
    throw new Error('Tool components must be used within Tool');
  }
  return context;
};

interface ToolProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: ToolStatus;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ToolHeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  description?: string;
  statusLabels?: Partial<ToolStatusLabels>;
}

type ToolContentProps = React.HTMLAttributes<HTMLDivElement>;

interface ToolInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: string;
  value?: unknown;
  children?: React.ReactNode;
}

interface ToolOutputProps extends ToolInputProps {
  error?: boolean;
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === undefined) return '';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

const ToolRoot = ({
  className,
  status = 'complete',
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
  ref,
  ...props
}: ToolProps & { ref?: React.Ref<HTMLDivElement> }) => {
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

  const value = React.useMemo<ToolContextValue>(
    () => ({ open, setOpen, status, id }),
    [open, setOpen, status, id],
  );

  return (
    <ToolContext value={value}>
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        data-status={status}
        className={cn(
          'border-border bg-card text-card-foreground w-full overflow-hidden rounded-lg border',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ToolContext>
  );
};

ToolRoot.displayName = 'Tool';

const ToolHeader = ({
  className,
  name,
  description,
  statusLabels,
  onClick,
  ref,
  ...props
}: ToolHeaderProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, status, id } = useToolContext();
  const shouldReduceMotion = useReducedMotion();
  const StatusIcon = STATUS_ICON[status];
  const statusLabel = statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status];

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
        'text-foreground hover:bg-muted/60 focus-visible:ring-ring flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-muted-foreground flex shrink-0">
        <WrenchIcon size={14} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-mono text-xs">{name}</span>
        {description ? (
          <span className="text-muted-foreground truncate text-xs">{description}</span>
        ) : null}
      </span>
      <span className={cn('flex shrink-0 items-center gap-1.5 text-xs', STATUS_TONE[status])}>
        {status === 'running' && !shouldReduceMotion ? (
          <motion.span
            aria-hidden="true"
            className="flex shrink-0"
            animate={SPIN_ANIMATE}
            transition={SPIN_TRANSITION}
          >
            <StatusIcon size={14} />
          </motion.span>
        ) : (
          <span aria-hidden="true" className="flex shrink-0">
            <StatusIcon size={14} />
          </span>
        )}
        <span className="sr-only">{statusLabel}</span>
      </span>
      <motion.span
        aria-hidden="true"
        className="text-muted-foreground flex shrink-0"
        animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
        transition={CHEVRON_TRANSITION}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
    </button>
  );
};

ToolHeader.displayName = 'ToolHeader';

const ToolContent = ({
  className,
  children,
  ref,
  ...props
}: ToolContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open, id } = useToolContext();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={TOOL_CONTENT_VARIANTS}
          initial="closed"
          animate="open"
          exit="closed"
          className="overflow-hidden"
        >
          <div
            className={cn('border-border flex flex-col gap-3 border-t px-3 py-3', className)}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ToolContent.displayName = 'ToolContent';

const ToolBlock = ({
  className,
  label,
  value,
  children,
  error = false,
  ref,
  ...props
}: ToolOutputProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const body = children ?? formatValue(value);

  return (
    <div
      ref={ref}
      data-error={error ? '' : undefined}
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      <span
        className={cn(
          'font-mono text-[10px] tracking-[0.2em] uppercase',
          error ? 'text-destructive-text' : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
      {typeof body === 'string' ? (
        <pre
          className={cn(
            'overflow-x-auto rounded-md px-3 py-2 font-mono text-xs leading-relaxed whitespace-pre-wrap',
            error
              ? 'bg-destructive-surface text-destructive-text border-destructive-border border'
              : 'bg-secondary text-foreground',
          )}
        >
          {body}
        </pre>
      ) : (
        <div
          className={cn(
            'rounded-md px-3 py-2 text-sm',
            error
              ? 'bg-destructive-surface text-destructive-text border-destructive-border border'
              : 'bg-secondary text-foreground',
          )}
        >
          {body}
        </div>
      )}
    </div>
  );
};

const ToolInput = ({
  label = 'Input',
  ref,
  ...props
}: ToolInputProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <ToolBlock ref={ref} label={label} {...props} />;
};

ToolInput.displayName = 'ToolInput';

const ToolOutput = ({
  label = 'Output',
  ref,
  ...props
}: ToolOutputProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <ToolBlock ref={ref} label={label} {...props} />;
};

ToolOutput.displayName = 'ToolOutput';

const Tool = Object.assign(ToolRoot, {
  Header: ToolHeader,
  Content: ToolContent,
  Input: ToolInput,
  Output: ToolOutput,
});

export { Tool };
export type {
  ToolContentProps,
  ToolHeaderProps,
  ToolInputProps,
  ToolOutputProps,
  ToolProps,
  ToolStatus,
  ToolStatusLabels,
};
