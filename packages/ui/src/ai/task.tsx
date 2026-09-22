'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { collapse, springs } from '../lib/motion';

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

const SPIN_ANIMATE = { rotate: 360 };
const SPIN_TRANSITION = { repeat: Infinity, duration: 1, ease: 'linear' } as const;

type TaskStatus = 'pending' | 'active' | 'complete' | 'error';

interface TaskContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const TaskContext = React.createContext<TaskContextValue | null>(null);

const useTaskContext = (): TaskContextValue => {
  const context = React.use(TaskContext);
  if (!context) {
    throw new Error('Task components must be used within Task');
  }
  return context;
};

interface TaskProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface TaskTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  status?: TaskStatus;
}

type TaskContentProps = React.HTMLAttributes<HTMLDivElement>;
type TaskItemProps = React.HTMLAttributes<HTMLDivElement>;
type TaskFileProps = React.HTMLAttributes<HTMLSpanElement>;

const STATUS_ICON: Record<TaskStatus, React.ComponentType<IconProps>> = {
  pending: ChevronDownIcon,
  active: LoaderIcon,
  complete: CheckIcon,
  error: AlertIcon,
};

const STATUS_TONE: Record<TaskStatus, string> = {
  pending: 'text-muted-foreground',
  active: 'text-foreground',
  complete: 'text-success-text',
  error: 'text-destructive-text',
};

const TaskRoot = ({
  className,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  children,
  ref,
  ...props
}: TaskProps & { ref?: React.Ref<HTMLDivElement> }) => {
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

  const value = React.useMemo<TaskContextValue>(() => ({ open, setOpen, id }), [open, setOpen, id]);

  return (
    <TaskContext value={value}>
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </div>
    </TaskContext>
  );
};

TaskRoot.displayName = 'Task';

const TaskTrigger = ({
  className,
  title,
  status = 'complete',
  children,
  onClick,
  ref,
  ...props
}: TaskTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id } = useTaskContext();
  const shouldReduceMotion = useReducedMotion();
  const StatusIcon = STATUS_ICON[status];

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
      {status === 'active' && !shouldReduceMotion ? (
        <motion.span
          aria-hidden="true"
          className={cn('flex shrink-0', STATUS_TONE[status])}
          animate={SPIN_ANIMATE}
          transition={SPIN_TRANSITION}
        >
          <StatusIcon size={14} />
        </motion.span>
      ) : (
        <span aria-hidden="true" className={cn('flex shrink-0', STATUS_TONE[status])}>
          <StatusIcon size={14} />
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-left">{children ?? title}</span>
      <motion.span
        aria-hidden="true"
        className="flex shrink-0"
        animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
        transition={springs.snappy}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
    </button>
  );
};

TaskTrigger.displayName = 'TaskTrigger';

const TaskContent = ({
  className,
  children,
  ref,
  ...props
}: TaskContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open, id } = useTaskContext();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={collapse}
          initial="closed"
          animate="open"
          exit="closed"
          className="overflow-hidden"
        >
          <div
            className={cn(
              'border-border text-muted-foreground mt-2 ml-[6px] flex flex-col gap-2 border-l pt-1 pb-1 pl-4 text-sm',
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

TaskContent.displayName = 'TaskContent';

const TaskItem = ({
  className,
  ref,
  ...props
}: TaskItemProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center gap-1.5 leading-relaxed', className)}
      {...props}
    />
  );
};

TaskItem.displayName = 'TaskItem';

const TaskFile = ({
  className,
  ref,
  ...props
}: TaskFileProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  return (
    <span
      ref={ref}
      className={cn(
        'border-border bg-secondary text-foreground inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-xs [&>svg]:size-3 [&>svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
};

TaskFile.displayName = 'TaskFile';

const Task = Object.assign(TaskRoot, {
  Trigger: TaskTrigger,
  Content: TaskContent,
  Item: TaskItem,
  File: TaskFile,
});

export { Task };
export type {
  TaskContentProps,
  TaskFileProps,
  TaskItemProps,
  TaskProps,
  TaskStatus,
  TaskTriggerProps,
};
