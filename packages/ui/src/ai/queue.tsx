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

const INSTANT_COLLAPSE: Variants = {
  closed: { height: 0, opacity: 0, transition: still },
  open: { height: 'auto', opacity: 1, transition: still },
};

interface QueueSectionContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const QueueSectionContext = React.createContext<QueueSectionContextValue | null>(null);

const useQueueSectionContext = (): QueueSectionContextValue => {
  const context = React.use(QueueSectionContext);
  if (!context) {
    throw new Error('Queue.SectionTrigger and Queue.List must be used within Queue.Section');
  }
  return context;
};

type QueueProps = React.HTMLAttributes<HTMLDivElement>;

interface QueueSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface QueueSectionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
}

type QueueListProps = React.HTMLAttributes<HTMLUListElement>;

interface QueueItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  done?: boolean;
  description?: React.ReactNode;
  doneLabel?: string;
  actions?: React.ReactNode;
}

interface QueueItemActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const QueueRoot = ({
  className,
  children,
  ref,
  ...props
}: QueueProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-slot="queue"
      className={cn(
        'border-border bg-card text-card-foreground divide-border w-full divide-y overflow-hidden rounded-lg border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

QueueRoot.displayName = 'Queue';

const QueueSection = ({
  className,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  children,
  ref,
  ...props
}: QueueSectionProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const id = React.useId();

  const value = React.useMemo<QueueSectionContextValue>(
    () => ({ open, setOpen, id }),
    [open, setOpen, id],
  );

  return (
    <QueueSectionContext value={value}>
      <div
        ref={ref}
        data-slot="queue-section"
        data-state={open ? 'open' : 'closed'}
        className={cn('flex flex-col', className)}
        {...props}
      >
        {children}
      </div>
    </QueueSectionContext>
  );
};

QueueSection.displayName = 'QueueSection';

const QueueSectionTrigger = ({
  className,
  count,
  children,
  onClick,
  ref,
  ...props
}: QueueSectionTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id } = useQueueSectionContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      data-slot="queue-section-trigger"
      aria-expanded={open}
      aria-controls={open ? `${id}-content` : undefined}
      onClick={(event) => {
        setOpen(!open);
        onClick?.(event);
      }}
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring flex w-full items-center gap-2 px-3 py-2 text-start font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        className,
      )}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className="flex shrink-0"
        initial={false}
        animate={shouldReduceMotion ? undefined : { rotate: open ? 0 : -90 }}
        transition={springs.snappy}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {typeof count === 'number' ? (
        <span className="bg-muted text-muted-strong shrink-0 rounded-sm px-1.5 tabular-nums">
          {count}
        </span>
      ) : null}
    </button>
  );
};

QueueSectionTrigger.displayName = 'QueueSectionTrigger';

const QueueList = ({
  className,
  children,
  ref,
  ...props
}: QueueListProps & { ref?: React.Ref<HTMLUListElement> }) => {
  const { open, id } = useQueueSectionContext();
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
          <ul
            ref={ref}
            data-slot="queue-list"
            className={cn('flex flex-col px-1.5 pb-1.5', className)}
            {...props}
          >
            {children}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

QueueList.displayName = 'QueueList';

const QueueItem = ({
  className,
  done = false,
  description,
  doneLabel = 'Done',
  actions,
  children,
  ref,
  ...props
}: QueueItemProps & { ref?: React.Ref<HTMLLIElement> }) => {
  return (
    <li
      ref={ref}
      data-slot="queue-item"
      data-state={done ? 'done' : 'queued'}
      className={cn(
        'group/queue-item hover:bg-muted/60 relative flex items-start gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition-colors',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
          done
            ? 'border-success-text bg-success-text text-background'
            : 'border-border-interactive',
        )}
      >
        {done ? <CheckIcon size={10} strokeWidth={2.5} /> : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            'break-words',
            done
              ? 'text-muted-foreground decoration-border-interactive line-through'
              : 'text-foreground',
          )}
        >
          {children}
          {done ? <span className="sr-only">{`, ${doneLabel}`}</span> : null}
        </span>
        {description ? (
          <span className="text-muted-foreground text-xs leading-relaxed">{description}</span>
        ) : null}
      </span>
      {actions ? (
        <span
          data-slot="queue-item-actions"
          className="flex shrink-0 items-center gap-0.5 transition-opacity group-hover/queue-item:opacity-100 focus-within:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0"
        >
          {actions}
        </span>
      ) : null}
    </li>
  );
};

QueueItem.displayName = 'QueueItem';

const QueueItemAction = ({
  className,
  label,
  children,
  ref,
  ...props
}: QueueItemActionProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      data-slot="queue-item-action"
      className={cn(
        'text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 pointer-coarse:size-9 [&_svg]:size-3.5',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

QueueItemAction.displayName = 'QueueItemAction';

const Queue = Object.assign(QueueRoot, {
  Section: QueueSection,
  SectionTrigger: QueueSectionTrigger,
  List: QueueList,
  Item: QueueItem,
  ItemAction: QueueItemAction,
});

export { Queue };
export type {
  QueueItemActionProps,
  QueueItemProps,
  QueueListProps,
  QueueProps,
  QueueSectionProps,
  QueueSectionTriggerProps,
};
