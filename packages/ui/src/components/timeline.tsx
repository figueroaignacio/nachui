'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

type TimelineOrientation = 'vertical' | 'horizontal';

interface TimelineLabels {
  completed: string;
  list: string;
}

const DEFAULT_LABELS: TimelineLabels = {
  completed: 'Completed',
  list: 'Timeline',
};

interface TimelineContextValue {
  orientation: TimelineOrientation;
  value: number;
  completedLabel: string;
}

interface TimelineItemContextValue {
  step: number;
  completed: boolean;
  active: boolean;
}

const TimelineContext = React.createContext<TimelineContextValue | null>(null);
const TimelineItemContext = React.createContext<TimelineItemContextValue | null>(null);

function useTimelineContext(): TimelineContextValue {
  const context = React.use(TimelineContext);
  if (!context) throw new Error('Timeline components must be used within Timeline');
  return context;
}

function useTimelineItemContext(): TimelineItemContextValue {
  const context = React.use(TimelineItemContext);
  if (!context) throw new Error('Timeline item parts must be used within Timeline.Item');
  return context;
}

const timelineVariants = cva('group/timeline m-0 flex list-none p-0', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal:
        'w-full flex-row overflow-x-auto rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    },
    alternate: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      orientation: 'vertical',
      alternate: true,
      className: [
        'sm:[&>[data-slot=timeline-item]]:w-[calc(50%+0.5rem)]',
        'sm:[&>[data-slot=timeline-item]:nth-child(odd)]:self-end',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)]:items-end',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)]:self-start',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)]:pe-8',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)]:ps-0',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)]:text-end',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)_[data-slot=timeline-indicator]]:right-2',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)_[data-slot=timeline-indicator]]:left-auto',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)_[data-slot=timeline-indicator]]:translate-x-1/2',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)_[data-slot=timeline-separator]]:right-2',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)_[data-slot=timeline-separator]]:left-auto',
        'sm:[&>[data-slot=timeline-item]:nth-child(even)_[data-slot=timeline-separator]]:translate-x-1/2',
      ].join(' '),
    },
  ],
  defaultVariants: {
    orientation: 'vertical',
    alternate: false,
  },
});

interface TimelineProps
  extends
    Omit<React.HTMLAttributes<HTMLOListElement>, 'defaultValue'>,
    VariantProps<typeof timelineVariants> {
  value?: number;
  labels?: Partial<TimelineLabels>;
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  step: number;
}

type TimelineHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type TimelineDateProps = React.TimeHTMLAttributes<HTMLTimeElement>;

interface TimelineTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

type TimelineIndicatorProps = React.HTMLAttributes<HTMLDivElement>;
type TimelineSeparatorProps = React.HTMLAttributes<HTMLDivElement>;
type TimelineContentProps = React.HTMLAttributes<HTMLDivElement>;

const TimelineRoot = ({
  className,
  orientation = 'vertical',
  alternate = false,
  value = 1,
  labels: labelOverrides,
  ref,
  ...props
}: TimelineProps & { ref?: React.Ref<HTMLOListElement> }) => {
  const resolvedOrientation: TimelineOrientation = orientation ?? 'vertical';
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const completedLabel = labels.completed;
  const context = React.useMemo(
    () => ({ orientation: resolvedOrientation, value, completedLabel }),
    [resolvedOrientation, value, completedLabel],
  );
  const scrollProps =
    resolvedOrientation === 'horizontal' ? { tabIndex: 0, 'aria-label': labels.list } : undefined;

  return (
    <TimelineContext value={context}>
      <ol
        ref={ref}
        data-slot="timeline"
        data-orientation={resolvedOrientation}
        {...scrollProps}
        className={cn(timelineVariants({ orientation: resolvedOrientation, alternate }), className)}
        {...props}
      />
    </TimelineContext>
  );
};

TimelineRoot.displayName = 'Timeline';

const TimelineItem = ({
  className,
  step,
  children,
  ref,
  ...props
}: TimelineItemProps & { ref?: React.Ref<HTMLLIElement> }) => {
  const { orientation, value, completedLabel } = useTimelineContext();
  const completed = step <= value;
  const active = step === value;
  const context = React.useMemo(() => ({ step, completed, active }), [step, completed, active]);

  return (
    <TimelineItemContext value={context}>
      <li
        ref={ref}
        data-slot="timeline-item"
        data-orientation={orientation}
        data-completed={completed ? '' : undefined}
        data-active={active ? '' : undefined}
        aria-current={active ? 'step' : undefined}
        className={cn(
          'group/item relative flex flex-1 flex-col gap-0.5',
          orientation === 'vertical' ? 'ps-8 pb-8 last:pb-0' : 'min-w-32 pe-8 pt-8 last:pe-0',
          className,
        )}
        {...props}
      >
        {completed && !active && completedLabel ? (
          <span className="sr-only">{completedLabel}</span>
        ) : null}
        {children}
      </li>
    </TimelineItemContext>
  );
};

TimelineItem.displayName = 'TimelineItem';

const TimelineHeader = ({
  className,
  ref,
  ...props
}: TimelineHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-slot="timeline-header"
      className={cn('flex flex-col gap-0.5', className)}
      {...props}
    />
  );
};

TimelineHeader.displayName = 'TimelineHeader';

const TimelineDate = ({
  className,
  ref,
  ...props
}: TimelineDateProps & { ref?: React.Ref<HTMLTimeElement> }) => {
  return (
    <time
      ref={ref}
      data-slot="timeline-date"
      className={cn('text-muted-foreground block text-xs', className)}
      {...props}
    />
  );
};

TimelineDate.displayName = 'TimelineDate';

const TimelineTitle = ({
  className,
  as: Component = 'h3',
  ref,
  ...props
}: TimelineTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => {
  return (
    <Component
      ref={ref}
      data-slot="timeline-title"
      className={cn('text-foreground text-sm font-medium', className)}
      {...props}
    />
  );
};

TimelineTitle.displayName = 'TimelineTitle';

const TimelineIndicator = ({
  className,
  ref,
  ...props
}: TimelineIndicatorProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { orientation } = useTimelineContext();
  useTimelineItemContext();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="timeline-indicator"
      className={cn(
        'border-border bg-background absolute z-10 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 [&_svg]:size-3',
        'group-data-[completed]/item:border-primary group-data-[completed]/item:bg-primary group-data-[completed]/item:text-primary-foreground',
        orientation === 'vertical' ? 'top-2.5 left-2' : 'top-2 left-2',
        className,
      )}
      {...props}
    />
  );
};

TimelineIndicator.displayName = 'TimelineIndicator';

const TimelineSeparator = ({
  className,
  ref,
  ...props
}: TimelineSeparatorProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { orientation } = useTimelineContext();
  useTimelineItemContext();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="timeline-separator"
      className={cn(
        'bg-border absolute group-last/item:hidden',
        'group-data-[completed]/item:bg-primary',
        orientation === 'vertical'
          ? 'top-2.5 -bottom-2.5 left-2 w-px -translate-x-1/2'
          : 'top-2 -right-2 left-2 h-px -translate-y-1/2',
        className,
      )}
      {...props}
    />
  );
};

TimelineSeparator.displayName = 'TimelineSeparator';

const TimelineContent = ({
  className,
  ref,
  ...props
}: TimelineContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-slot="timeline-content"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};

TimelineContent.displayName = 'TimelineContent';

const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
  Header: TimelineHeader,
  Date: TimelineDate,
  Title: TimelineTitle,
  Indicator: TimelineIndicator,
  Separator: TimelineSeparator,
  Content: TimelineContent,
});

export { Timeline, timelineVariants, useTimelineItemContext };
export type {
  TimelineContentProps,
  TimelineDateProps,
  TimelineHeaderProps,
  TimelineIndicatorProps,
  TimelineItemProps,
  TimelineLabels,
  TimelineOrientation,
  TimelineProps,
  TimelineSeparatorProps,
  TimelineTitleProps,
};
