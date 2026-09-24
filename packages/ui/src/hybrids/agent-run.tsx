'use client';

import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { Context } from '../ai/context';
import { Reasoning } from '../ai/reasoning';
import { Response } from '../ai/response';
import { Task, type TaskStatus } from '../ai/task';
import { Tool, type ToolStatus } from '../ai/tool';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

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

const SPIN_ANIMATE = { rotate: 360 };
const SPIN_TRANSITION = { repeat: Infinity, duration: 1, ease: 'linear' } as const;
const BAR_TRANSITION = { type: 'spring', stiffness: 220, damping: 30 } as const;

type AgentRunStatus = 'idle' | 'running' | 'complete' | 'error';

interface AgentTool {
  id: string;
  name: string;
  status: ToolStatus;
  description?: string;
  input?: unknown;
  output?: unknown;
  error?: boolean;
}

interface AgentStep {
  id: string;
  title: string;
  status: TaskStatus;
  detail?: string;
  reasoning?: string;
  tools?: AgentTool[];
  files?: string[];
}

interface AgentRunLabels {
  idle: string;
  running: string;
  complete: string;
  error: string;
  input: string;
  output: string;
  progress: (done: number, total: number) => string;
}

const DEFAULT_LABELS: AgentRunLabels = {
  idle: 'Waiting',
  running: 'Running',
  complete: 'Done',
  error: 'Failed',
  input: 'Input',
  output: 'Output',
  progress: (done, total) => `${done} of ${total} steps`,
};

const STATUS_ICON: Record<AgentRunStatus, React.ComponentType<IconProps>> = {
  idle: DotIcon,
  running: LoaderIcon,
  complete: CheckIcon,
  error: AlertIcon,
};

const STATUS_TONE: Record<AgentRunStatus, string> = {
  idle: 'text-muted-foreground border-border',
  running: 'text-foreground border-border',
  complete: 'text-success-text border-success-border',
  error: 'text-destructive-text border-destructive-border',
};

interface AgentRunContextValue {
  title?: string;
  status: AgentRunStatus;
  steps: AgentStep[];
  answer?: React.ReactNode;
  usage?: { used: number; max: number };
  startedAt?: Date | number;
  finishedAt?: Date | number;
  labels: AgentRunLabels;
  defaultOpen?: boolean;
}

const AgentRunContext = React.createContext<AgentRunContextValue | null>(null);

const useAgentRun = (): AgentRunContextValue => {
  const context = React.use(AgentRunContext);
  if (!context) {
    throw new Error('AgentRun components must be used within AgentRun');
  }
  return context;
};

function agentRunProgress(steps: AgentStep[]): { done: number; total: number; ratio: number } {
  const total = steps.length;
  const done = steps.filter((step) => step.status === 'complete').length;
  return { done, total, ratio: total === 0 ? 0 : done / total };
}

function toMillis(value: Date | number): number {
  return value instanceof Date ? value.getTime() : value;
}

function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest.toString().padStart(2, '0')}s`;
}

function useElapsed(
  startedAt: Date | number | undefined,
  finishedAt: Date | number | undefined,
  live: boolean,
): string | null {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!live || startedAt === undefined || finishedAt !== undefined) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [live, startedAt, finishedAt]);

  if (startedAt === undefined) return null;
  const end = finishedAt !== undefined ? toMillis(finishedAt) : live ? now : toMillis(startedAt);
  return formatElapsed(end - toMillis(startedAt));
}

interface AgentRunProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  status?: AgentRunStatus;
  steps: AgentStep[];
  answer?: React.ReactNode;
  usage?: { used: number; max: number };
  startedAt?: Date | number;
  finishedAt?: Date | number;
  labels?: Partial<AgentRunLabels>;
  defaultOpen?: boolean;
}

type AgentRunHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type AgentRunStepsProps = React.HTMLAttributes<HTMLDivElement>;
type AgentRunProgressProps = React.HTMLAttributes<HTMLDivElement>;
type AgentRunAnswerProps = React.HTMLAttributes<HTMLDivElement>;
type AgentRunFooterProps = React.HTMLAttributes<HTMLDivElement>;

const AgentRunRoot = ({
  className,
  title,
  status = 'idle',
  steps,
  answer,
  usage,
  startedAt,
  finishedAt,
  labels,
  defaultOpen,
  children,
  ref,
  ...props
}: AgentRunProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const mergedLabels = React.useMemo<AgentRunLabels>(
    () => ({ ...DEFAULT_LABELS, ...labels }),
    [labels],
  );

  const value = React.useMemo<AgentRunContextValue>(
    () => ({
      title,
      status,
      steps,
      answer,
      usage,
      startedAt,
      finishedAt,
      labels: mergedLabels,
      defaultOpen,
    }),
    [title, status, steps, answer, usage, startedAt, finishedAt, mergedLabels, defaultOpen],
  );

  return (
    <AgentRunContext value={value}>
      <div
        ref={ref}
        data-status={status}
        className={cn(
          'border-border bg-card text-card-foreground divide-rule flex w-full flex-col divide-y overflow-hidden rounded-lg border',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <AgentRunHeader />
            <AgentRunProgress />
            <AgentRunSteps />
            <AgentRunAnswer />
            <AgentRunFooter />
          </>
        )}
      </div>
    </AgentRunContext>
  );
};

AgentRunRoot.displayName = 'AgentRun';

const AgentRunHeader = ({
  className,
  children,
  ref,
  ...props
}: AgentRunHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { title, status, startedAt, finishedAt, labels } = useAgentRun();
  const shouldReduceMotion = useReducedMotion();
  const StatusIcon = STATUS_ICON[status];
  const elapsed = useElapsed(startedAt, finishedAt, status === 'running');

  return (
    <div ref={ref} className={cn('flex items-center gap-3 px-4 py-3', className)} {...props}>
      <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
        {children ?? title}
      </span>
      {elapsed ? (
        <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
          {elapsed}
        </span>
      ) : null}
      <span
        data-status={status}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px]',
          STATUS_TONE[status],
        )}
      >
        {status === 'running' && !shouldReduceMotion ? (
          <motion.span className="flex" animate={SPIN_ANIMATE} transition={SPIN_TRANSITION}>
            <StatusIcon size={12} />
          </motion.span>
        ) : (
          <span className="flex">
            <StatusIcon size={12} />
          </span>
        )}
        {labels[status]}
      </span>
    </div>
  );
};

AgentRunHeader.displayName = 'AgentRunHeader';

const AgentRunProgress = ({
  className,
  ref,
  ...props
}: AgentRunProgressProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { steps, labels } = useAgentRun();
  const shouldReduceMotion = useReducedMotion();
  const { done, total, ratio } = agentRunProgress(steps);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label={labels.progress(done, total)}
      className={cn('bg-secondary relative h-1 w-full', className)}
      {...props}
    >
      <motion.div
        className="bg-foreground absolute inset-y-0 left-0"
        initial={false}
        animate={{ width: `${ratio * 100}%` }}
        transition={shouldReduceMotion ? { duration: 0 } : BAR_TRANSITION}
      />
    </div>
  );
};

AgentRunProgress.displayName = 'AgentRunProgress';

function StepTools({ tools, labels }: { tools: AgentTool[]; labels: AgentRunLabels }) {
  return (
    <div className="flex flex-col gap-2">
      {tools.map((tool) => (
        <Tool key={tool.id} status={tool.status} defaultOpen={tool.status === 'error'}>
          <Tool.Header name={tool.name} description={tool.description} />
          <Tool.Content>
            {tool.input !== undefined ? (
              <Tool.Input label={labels.input} value={tool.input} />
            ) : null}
            {tool.output !== undefined ? (
              <Tool.Output label={labels.output} value={tool.output} error={tool.error} />
            ) : null}
          </Tool.Content>
        </Tool>
      ))}
    </div>
  );
}

const AgentRunSteps = ({
  className,
  ref,
  ...props
}: AgentRunStepsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { steps, labels, defaultOpen } = useAgentRun();

  return (
    <div ref={ref} className={cn('flex flex-col gap-3 px-4 py-3', className)} {...props}>
      {steps.map((step) => (
        <Task key={step.id} defaultOpen={defaultOpen ?? step.status === 'active'}>
          <Task.Trigger title={step.title} status={step.status} />
          <Task.Content>
            {step.detail ? <Task.Item>{step.detail}</Task.Item> : null}
            {step.files?.length ? (
              <Task.Item>
                {step.files.map((file) => (
                  <Task.File key={file}>{file}</Task.File>
                ))}
              </Task.Item>
            ) : null}
            {step.reasoning ? (
              <Reasoning isStreaming={step.status === 'active'} defaultOpen={false}>
                <Reasoning.Trigger />
                <Reasoning.Content>{step.reasoning}</Reasoning.Content>
              </Reasoning>
            ) : null}
            {step.tools?.length ? <StepTools tools={step.tools} labels={labels} /> : null}
          </Task.Content>
        </Task>
      ))}
    </div>
  );
};

AgentRunSteps.displayName = 'AgentRunSteps';

const AgentRunAnswer = ({
  className,
  children,
  ref,
  ...props
}: AgentRunAnswerProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { status, answer } = useAgentRun();
  const body = children ?? answer;

  if (status === 'running' && body === undefined) {
    return (
      <div ref={ref} className={cn('px-4 py-3', className)} {...props}>
        <Response.Skeleton />
      </div>
    );
  }

  if (body === undefined || body === null) return null;

  return (
    <div ref={ref} className={cn('px-4 py-3', className)} {...props}>
      <Response isStreaming={status === 'running'}>{body}</Response>
    </div>
  );
};

AgentRunAnswer.displayName = 'AgentRunAnswer';

const AgentRunFooter = ({
  className,
  children,
  ref,
  ...props
}: AgentRunFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { usage, steps, labels } = useAgentRun();
  const { done, total } = agentRunProgress(steps);

  if (!usage && !children) return null;

  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-3 px-4 py-2', className)}
      {...props}
    >
      <span className="text-muted-foreground font-mono text-xs tabular-nums">
        {labels.progress(done, total)}
      </span>
      {children ??
        (usage ? (
          <Context maxTokens={usage.max} usedTokens={usage.used}>
            <Context.Trigger />
            <Context.Content align="end">
              <Context.Header />
            </Context.Content>
          </Context>
        ) : null)}
    </div>
  );
};

AgentRunFooter.displayName = 'AgentRunFooter';

const AgentRun = Object.assign(AgentRunRoot, {
  Header: AgentRunHeader,
  Progress: AgentRunProgress,
  Steps: AgentRunSteps,
  Answer: AgentRunAnswer,
  Footer: AgentRunFooter,
});

export { AgentRun, agentRunProgress, useAgentRun };
export type {
  AgentRunAnswerProps,
  AgentRunFooterProps,
  AgentRunHeaderProps,
  AgentRunLabels,
  AgentRunProgressProps,
  AgentRunProps,
  AgentRunStatus,
  AgentRunStepsProps,
  AgentStep,
  AgentTool,
};
