'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

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

const ActionsIcons = {
  copy: CopyIcon,
  check: CheckIcon,
  retry: RetryIcon,
  thumbsUp: ThumbsUpIcon,
  thumbsDown: ThumbsDownIcon,
  share: ShareIcon,
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
  timeout?: number;
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
  active = false,
  type = 'button',
  ref,
  ...props
}: ActionsButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      data-active={active ? 'true' : undefined}
      className={cn(
        'text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:ring-ring inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
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
  timeout = 1500,
  onClick,
  ref,
  ...props
}: ActionsCopyProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), timeout);
    return () => window.clearTimeout(timer);
  }, [copied, timeout]);

  return (
    <ActionsButton
      ref={ref}
      label={copied ? copiedLabel : label}
      active={copied}
      onClick={(event) => {
        void navigator.clipboard?.writeText(text).then(() => setCopied(true));
        onClick?.(event);
      }}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </ActionsButton>
  );
};

ActionsCopy.displayName = 'ActionsCopy';

const Actions = Object.assign(ActionsRoot, {
  Button: ActionsButton,
  Copy: ActionsCopy,
  Icons: ActionsIcons,
});

export { Actions };
export type { ActionsButtonProps, ActionsCopyProps, ActionsProps };
