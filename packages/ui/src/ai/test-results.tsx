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

function XIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}

function SkipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 12h12" />
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

const INSTANT_COLLAPSE: Variants = {
  closed: { height: 0, opacity: 0, transition: still },
  open: { height: 'auto', opacity: 1, transition: still },
};

type TestStatus = 'passed' | 'failed' | 'skipped' | 'running';

type TestStatusLabels = Record<TestStatus, string>;

const DEFAULT_STATUS_LABELS: TestStatusLabels = {
  passed: 'Passed',
  failed: 'Failed',
  skipped: 'Skipped',
  running: 'Running',
};

const STATUS_ICON: Record<TestStatus, React.ComponentType<IconProps>> = {
  passed: CheckIcon,
  failed: XIcon,
  skipped: SkipIcon,
  running: LoaderIcon,
};

const STATUS_TONE: Record<TestStatus, string> = {
  passed: 'text-success-text',
  failed: 'text-destructive-text',
  skipped: 'text-muted-foreground',
  running: 'text-foreground',
};

interface TestResultsSummaryValue {
  passed: number;
  failed: number;
  skipped?: number;
}

interface TestResultsContextValue {
  summary?: TestResultsSummaryValue;
}

const TestResultsContext = React.createContext<TestResultsContextValue | null>(null);

const useTestResultsContext = (): TestResultsContextValue => {
  const context = React.use(TestResultsContext);
  if (!context) {
    throw new Error('TestResults components must be used within TestResults');
  }
  return context;
};

interface TestResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  summary?: TestResultsSummaryValue;
}

interface TestResultsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: React.ReactNode;
}

interface TestResultsSummaryProps extends React.HTMLAttributes<HTMLDListElement> {
  passedLabel?: string;
  failedLabel?: string;
  skippedLabel?: string;
}

interface TestResultsSuiteProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  name: React.ReactNode;
  status?: TestStatus;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  statusLabels?: Partial<TestStatusLabels>;
}

interface TestResultsTestProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  name: React.ReactNode;
  status?: TestStatus;
  duration?: React.ReactNode;
  statusLabels?: Partial<TestStatusLabels>;
}

type TestResultsErrorProps = React.HTMLAttributes<HTMLPreElement>;

const TestResultsRoot = ({
  className,
  summary,
  children,
  ref,
  ...props
}: TestResultsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const value = React.useMemo<TestResultsContextValue>(() => ({ summary }), [summary]);
  const failed = (summary?.failed ?? 0) > 0;

  return (
    <TestResultsContext value={value}>
      <div
        ref={ref}
        data-slot="test-results"
        data-failed={failed ? '' : undefined}
        className={cn(
          'border-border bg-card text-card-foreground w-full min-w-0 overflow-hidden rounded-lg border',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TestResultsContext>
  );
};

TestResultsRoot.displayName = 'TestResults';

const TestResultsHeader = ({
  className,
  duration,
  children,
  ref,
  ...props
}: TestResultsHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-slot="test-results-header"
      className={cn(
        'bg-surface-muted border-border text-muted-strong flex min-h-10 items-center gap-2 border-b px-3 font-mono text-xs',
        className,
      )}
      {...props}
    >
      <span className="text-foreground min-w-0 flex-1 truncate">{children}</span>
      {duration ? (
        <span className="text-muted-foreground shrink-0 tabular-nums">{duration}</span>
      ) : null}
    </div>
  );
};

TestResultsHeader.displayName = 'TestResultsHeader';

const TestResultsSummary = ({
  className,
  passedLabel = 'Passed',
  failedLabel = 'Failed',
  skippedLabel = 'Skipped',
  ref,
  ...props
}: TestResultsSummaryProps & { ref?: React.Ref<HTMLDListElement> }) => {
  const { summary } = useTestResultsContext();
  if (!summary) return null;

  const skipped = summary.skipped ?? 0;
  const total = summary.passed + summary.failed + skipped;
  const stats = [
    { key: 'passed', label: passedLabel, count: summary.passed, tone: 'text-success-text' },
    {
      key: 'failed',
      label: failedLabel,
      count: summary.failed,
      tone: summary.failed > 0 ? 'text-destructive-text' : 'text-foreground',
    },
    { key: 'skipped', label: skippedLabel, count: skipped, tone: 'text-foreground' },
  ];

  return (
    <div data-slot="test-results-summary" className="flex flex-col gap-2 px-3 pt-3">
      <dl ref={ref} className={cn('grid grid-cols-3 gap-2', className)} {...props}>
        {stats.map((stat) => (
          <div
            key={stat.key}
            data-slot={`test-results-${stat.key}`}
            className={cn(
              'bg-surface-muted flex flex-col-reverse gap-0.5 rounded-md px-3 py-2',
              stat.key === 'failed' && summary.failed > 0 && 'bg-destructive-surface',
            )}
          >
            <dt className="text-muted-foreground text-xs">{stat.label}</dt>
            <dd className={cn('font-heading text-xl font-semibold tabular-nums', stat.tone)}>
              {stat.count}
            </dd>
          </div>
        ))}
      </dl>
      {total > 0 ? (
        <div aria-hidden="true" className="bg-muted flex h-1 overflow-hidden rounded-full">
          <span
            className="bg-success-text"
            style={{ width: `${(summary.passed / total) * 100}%` }}
          />
          <span
            className="bg-destructive-text"
            style={{ width: `${(summary.failed / total) * 100}%` }}
          />
        </div>
      ) : null}
    </div>
  );
};

TestResultsSummary.displayName = 'TestResultsSummary';

const TestResultsSuites = ({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-slot="test-results-suites"
      className={cn('flex flex-col gap-1 p-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
};

TestResultsSuites.displayName = 'TestResultsSuites';

const TestResultsSuite = ({
  className,
  name,
  status = 'passed',
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  statusLabels,
  children,
  ref,
  ...props
}: TestResultsSuiteProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen ?? status === 'failed',
    onChange: onOpenChange,
  });
  const id = React.useId();
  const shouldReduceMotion = useReducedMotion();
  const StatusIcon = STATUS_ICON[status];
  const statusLabel = statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status];

  return (
    <div
      ref={ref}
      data-slot="test-results-suite"
      data-status={status}
      data-state={open ? 'open' : 'closed'}
      className={cn('flex flex-col', className)}
      {...props}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={open ? `${id}-content` : undefined}
        onClick={() => setOpen(!open)}
        className="hover:bg-muted/60 focus-visible:ring-ring flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-start font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex shrink-0',
            STATUS_TONE[status],
            status === 'running' && 'motion-safe:animate-spin',
          )}
        >
          <StatusIcon size={14} />
        </span>
        <span className="text-foreground min-w-0 flex-1 truncate">
          {name}
          <span className="sr-only">{`, ${statusLabel}`}</span>
        </span>
        <motion.span
          aria-hidden="true"
          className="text-muted-foreground flex shrink-0"
          initial={false}
          animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
          transition={springs.snappy}
        >
          <ChevronDownIcon size={14} />
        </motion.span>
      </button>
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
            <ul className="border-border ms-[13px] flex flex-col gap-0.5 border-s py-1 ps-2.5">
              {children}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

TestResultsSuite.displayName = 'TestResultsSuite';

const TestResultsTest = ({
  className,
  name,
  status = 'passed',
  duration,
  statusLabels,
  children,
  ref,
  ...props
}: TestResultsTestProps & { ref?: React.Ref<HTMLLIElement> }) => {
  const StatusIcon = STATUS_ICON[status];
  const statusLabel = statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status];

  return (
    <li
      ref={ref}
      data-slot="test-results-test"
      data-status={status}
      className={cn('flex flex-col gap-1.5 py-1', className)}
      {...props}
    >
      <span className="flex items-center gap-2 text-xs">
        <span
          aria-hidden="true"
          className={cn(
            'flex shrink-0',
            STATUS_TONE[status],
            status === 'running' && 'motion-safe:animate-spin',
          )}
        >
          <StatusIcon size={12} />
        </span>
        <span
          className={cn(
            'min-w-0 flex-1 truncate',
            status === 'failed' ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {name}
          <span className="sr-only">{`, ${statusLabel}`}</span>
        </span>
        {duration ? (
          <span className="text-muted-foreground shrink-0 font-mono tabular-nums">{duration}</span>
        ) : null}
      </span>
      {children}
    </li>
  );
};

TestResultsTest.displayName = 'TestResultsTest';

const TestResultsError = ({
  className,
  children,
  ref,
  ...props
}: TestResultsErrorProps & { ref?: React.Ref<HTMLPreElement> }) => {
  return (
    <pre
      ref={ref}
      data-slot="test-results-error"
      className={cn(
        'bg-destructive-surface text-destructive-text border-destructive-border overflow-x-auto rounded-md border px-2.5 py-2 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap',
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  );
};

TestResultsError.displayName = 'TestResultsError';

const TestResults = Object.assign(TestResultsRoot, {
  Header: TestResultsHeader,
  Summary: TestResultsSummary,
  Suites: TestResultsSuites,
  Suite: TestResultsSuite,
  Test: TestResultsTest,
  Error: TestResultsError,
});

export { TestResults };
export type {
  TestResultsErrorProps,
  TestResultsHeaderProps,
  TestResultsProps,
  TestResultsSuiteProps,
  TestResultsSummaryProps,
  TestResultsSummaryValue,
  TestResultsTestProps,
  TestStatus,
  TestStatusLabels,
};
