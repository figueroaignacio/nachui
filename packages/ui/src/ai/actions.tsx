'use client';

import * as React from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function Icon({ size = 24, strokeWidth = 1.5, children, ...props }: IconProps) {
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

function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </Icon>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}

function RetryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </Icon>
  );
}

function ThumbsUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </Icon>
  );
}

function ThumbsDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </Icon>
  );
}

function ShareIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </Icon>
  );
}

function EditIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m14 6 4 4" />
    </Icon>
  );
}

function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m15 6-6 6 6 6" />
    </Icon>
  );
}

function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 6 6 6-6 6" />
    </Icon>
  );
}

const ActionsIcons = {
  copy: CopyIcon,
  check: CheckIcon,
  retry: RetryIcon,
  thumbsUp: ThumbsUpIcon,
  thumbsDown: ThumbsDownIcon,
  share: ShareIcon,
  edit: EditIcon,
};

interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
}

interface ActionsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

interface ActionsCopyProps extends Omit<ActionsButtonProps, 'label' | 'children'> {
  text: string;
  label?: string;
  copiedLabel?: string;
  failedLabel?: string;
  timeout?: number;
}

type ActionsFeedbackValue = 'up' | 'down' | null;

interface ActionsFeedbackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  value?: ActionsFeedbackValue;
  defaultValue?: ActionsFeedbackValue;
  onValueChange?: (value: ActionsFeedbackValue) => void;
  upLabel?: string;
  downLabel?: string;
}

interface ActionsBranchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  count: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  formatLabel?: (current: number, count: number) => string;
}

const ActionsRoot = ({
  className,
  align = 'start',
  ref,
  ...props
}: ActionsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-align={align}
      className={cn('flex items-center gap-1', align === 'end' && 'justify-end', className)}
      {...props}
    />
  );
};

ActionsRoot.displayName = 'Actions';

const ActionsButton = ({
  className,
  label,
  active,
  type = 'button',
  ref,
  ...props
}: ActionsButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={active}
      title={label}
      data-active={active ? 'true' : undefined}
      className={cn(
        'text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:ring-ring inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 pointer-coarse:size-9',
        'data-[active=true]:text-foreground [&>svg]:size-3.5 [&>svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
};

ActionsButton.displayName = 'ActionsButton';

const ActionsCopy = ({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  failedLabel = 'Copy failed',
  timeout = 1500,
  onClick,
  ref,
  ...props
}: ActionsCopyProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');
  const copied = state === 'copied';

  React.useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), timeout);
    return () => window.clearTimeout(timer);
  }, [state, timeout]);

  return (
    <>
      <ActionsButton
        ref={ref}
        label={copied ? copiedLabel : label}
        data-active={copied ? 'true' : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (!navigator.clipboard?.writeText) {
            setState('failed');
            return;
          }
          navigator.clipboard.writeText(text).then(
            () => setState('copied'),
            () => setState('failed'),
          );
        }}
        {...props}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </ActionsButton>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : state === 'failed' ? failedLabel : ''}
      </span>
    </>
  );
};

ActionsCopy.displayName = 'ActionsCopy';

const ActionsFeedback = ({
  className,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  upLabel = 'Good response',
  downLabel = 'Bad response',
  ref,
  ...props
}: ActionsFeedbackProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [value, setValue] = useControllableState<ActionsFeedbackValue>({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <div
      ref={ref}
      data-slot="actions-feedback"
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      <ActionsButton
        label={upLabel}
        active={value === 'up'}
        onClick={() => setValue(value === 'up' ? null : 'up')}
      >
        <ThumbsUpIcon />
      </ActionsButton>
      <ActionsButton
        label={downLabel}
        active={value === 'down'}
        onClick={() => setValue(value === 'down' ? null : 'down')}
      >
        <ThumbsDownIcon />
      </ActionsButton>
    </div>
  );
};

ActionsFeedback.displayName = 'ActionsFeedback';

const ActionsBranch = ({
  className,
  count,
  value: controlledValue,
  defaultValue,
  onValueChange,
  previousLabel = 'Previous version',
  nextLabel = 'Next version',
  formatLabel = (current, total) => `${current} / ${total}`,
  ref,
  ...props
}: ActionsBranchProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const last = Math.max(count - 1, 0);
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue: defaultValue ?? last,
    onChange: onValueChange,
  });
  const current = Math.min(Math.max(value, 0), last);

  if (count < 2) return null;

  return (
    <div
      ref={ref}
      role="group"
      aria-label={formatLabel(current + 1, count)}
      data-slot="actions-branch"
      className={cn('text-muted-foreground flex items-center', className)}
      {...props}
    >
      <ActionsButton
        label={previousLabel}
        disabled={current === 0}
        onClick={() => setValue(current - 1)}
      >
        <ChevronLeftIcon />
      </ActionsButton>
      <span aria-live="polite" className="min-w-9 text-center font-mono text-xs tabular-nums">
        {formatLabel(current + 1, count)}
      </span>
      <ActionsButton
        label={nextLabel}
        disabled={current === last}
        onClick={() => setValue(current + 1)}
      >
        <ChevronRightIcon />
      </ActionsButton>
    </div>
  );
};

ActionsBranch.displayName = 'ActionsBranch';

const Actions = Object.assign(ActionsRoot, {
  Button: ActionsButton,
  Copy: ActionsCopy,
  Feedback: ActionsFeedback,
  Branch: ActionsBranch,
  Icons: ActionsIcons,
});

export { Actions };
export type {
  ActionsBranchProps,
  ActionsButtonProps,
  ActionsCopyProps,
  ActionsFeedbackProps,
  ActionsFeedbackValue,
  ActionsProps,
};
