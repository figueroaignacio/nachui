'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

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

function CopyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
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

function PromptIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 7 5 5-5 5" />
      <path d="M12 19h7" />
    </Svg>
  );
}

const COPIED_TIMEOUT = 1500;
const STICK_THRESHOLD = 24;

type TerminalStatus = 'running' | 'complete';

interface TerminalContextValue {
  command?: string;
  output: string;
  lines: string[];
  status: TerminalStatus;
  exitCode?: number;
  duration?: React.ReactNode;
}

const TerminalContext = React.createContext<TerminalContextValue | null>(null);

const useTerminalContext = (): TerminalContextValue => {
  const context = React.use(TerminalContext);
  if (!context) {
    throw new Error('Terminal components must be used within Terminal');
  }
  return context;
};

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  command?: string;
  output?: string;
  status?: TerminalStatus;
  exitCode?: number;
  duration?: React.ReactNode;
}

interface TerminalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  runningLabel?: string;
  exitLabel?: (code: number) => string;
}

interface TerminalContentProps extends React.HTMLAttributes<HTMLPreElement> {
  label?: string;
  renderLine?: (line: string, index: number) => React.ReactNode;
  finishedLabel?: (exitCode: number | undefined) => string;
}

interface TerminalCopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  copyLabel?: string;
  copiedLabel?: string;
  failedLabel?: string;
  onCopied?: (output: string) => void;
}

const splitLines = (output: string): string[] => {
  if (output === '') return [];
  const lines = output.replace(/\r\n/g, '\n').split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
};

const TerminalRoot = ({
  className,
  command,
  output = '',
  status = 'complete',
  exitCode,
  duration,
  children,
  ref,
  ...props
}: TerminalProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const lines = React.useMemo(() => splitLines(output), [output]);

  const value = React.useMemo<TerminalContextValue>(
    () => ({ command, output, lines, status, exitCode, duration }),
    [command, output, lines, status, exitCode, duration],
  );

  const failed = status === 'complete' && typeof exitCode === 'number' && exitCode !== 0;

  return (
    <TerminalContext value={value}>
      <div
        ref={ref}
        data-slot="terminal"
        data-status={status}
        data-failed={failed ? '' : undefined}
        className={cn(
          'border-border bg-code text-foreground w-full min-w-0 overflow-hidden rounded-lg border',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TerminalContext>
  );
};

TerminalRoot.displayName = 'Terminal';

const TerminalHeader = ({
  className,
  runningLabel = 'Running',
  exitLabel = (code) => `exit ${code}`,
  children,
  ref,
  ...props
}: TerminalHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { command, status, exitCode, duration } = useTerminalContext();
  const failed = typeof exitCode === 'number' && exitCode !== 0;

  return (
    <div
      ref={ref}
      data-slot="terminal-header"
      className={cn(
        'bg-surface-muted border-border text-muted-strong flex min-h-10 items-center gap-2 border-b ps-3 pe-1.5 font-mono text-xs',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-muted-foreground flex shrink-0">
        <PromptIcon size={14} />
      </span>
      <span className="text-foreground min-w-0 flex-1 truncate" title={command}>
        {command}
      </span>
      {status === 'running' ? (
        <span className="text-muted-foreground flex shrink-0 items-center gap-1.5">
          <span aria-hidden="true" className="flex motion-safe:animate-spin">
            <LoaderIcon size={12} />
          </span>
          {runningLabel}
        </span>
      ) : typeof exitCode === 'number' ? (
        <span
          data-slot="terminal-exit-code"
          className={cn('shrink-0', failed ? 'text-destructive-text' : 'text-success-text')}
        >
          {exitLabel(exitCode)}
        </span>
      ) : null}
      {duration ? (
        <span className="text-muted-foreground shrink-0 tabular-nums">{duration}</span>
      ) : null}
      {children}
    </div>
  );
};

TerminalHeader.displayName = 'TerminalHeader';

const TerminalContent = ({
  className,
  label,
  renderLine,
  finishedLabel = (code) =>
    typeof code === 'number' ? `Command finished with exit code ${code}` : 'Command finished',
  tabIndex,
  onScroll,
  ref,
  ...props
}: TerminalContentProps & { ref?: React.Ref<HTMLPreElement> }) => {
  const { command, lines, status, exitCode } = useTerminalContext();
  const innerRef = React.useRef<HTMLPreElement>(null);
  const stuck = React.useRef(true);
  const [previousStatus, setPreviousStatus] = React.useState(status);
  const [finished, setFinished] = React.useState(false);

  if (status !== previousStatus) {
    setPreviousStatus(status);
    setFinished(previousStatus === 'running' && status === 'complete');
  }

  React.useImperativeHandle(ref, () => innerRef.current as HTMLPreElement, []);

  React.useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node || !stuck.current) return;
    node.scrollTop = node.scrollHeight;
  }, [lines]);

  React.useEffect(() => {
    const node = innerRef.current;
    const content = node?.firstElementChild;
    if (!node || !content || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (stuck.current) node.scrollTop = node.scrollHeight;
    });
    observer.observe(node);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <pre
        ref={innerRef}
        role="region"
        tabIndex={tabIndex ?? 0}
        aria-label={label ?? (command ? `Output of ${command}` : 'Output')}
        aria-busy={status === 'running' || undefined}
        data-slot="terminal-content"
        onScroll={(event) => {
          const node = event.currentTarget;
          stuck.current = node.scrollHeight - node.scrollTop - node.clientHeight < STICK_THRESHOLD;
          onScroll?.(event);
        }}
        className={cn(
          'focus-visible:ring-ring m-0 max-h-80 overflow-auto px-3 py-2.5 font-mono text-xs leading-relaxed focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
          className,
        )}
        {...props}
      >
        <code className="block min-w-max">
          {lines.map((line, index) => (
            <span key={index} data-line className="block whitespace-pre">
              {renderLine ? renderLine(line, index) : line || ' '}
            </span>
          ))}
          {status === 'running' ? (
            <span
              aria-hidden="true"
              data-slot="terminal-cursor"
              className="bg-foreground/70 inline-block h-3.5 w-1.5 translate-y-0.5 motion-safe:animate-pulse"
            />
          ) : null}
        </code>
      </pre>
      <span role="status" className="sr-only">
        {finished ? finishedLabel(exitCode) : ''}
      </span>
    </>
  );
};

TerminalContent.displayName = 'TerminalContent';

const TerminalCopyButton = ({
  className,
  copyLabel = 'Copy output',
  copiedLabel = 'Copied',
  failedLabel = 'Copy failed',
  onCopied,
  onClick,
  ref,
  ...props
}: TerminalCopyButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { output } = useTerminalContext();
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const copied = state === 'copied';

  React.useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const settle = (next: 'copied' | 'failed') => {
    setState(next);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState('idle'), COPIED_TIMEOUT);
  };

  const label = copied ? copiedLabel : copyLabel;

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        data-slot="terminal-copy-button"
        data-copied={copied ? '' : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (!navigator.clipboard?.writeText) {
            settle('failed');
            return;
          }
          navigator.clipboard.writeText(output).then(
            () => {
              onCopied?.(output);
              settle('copied');
            },
            () => settle('failed'),
          );
        }}
        className={cn(
          'text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring data-[copied]:text-success-text inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none pointer-coarse:size-9',
          className,
        )}
        {...props}
      >
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : state === 'failed' ? failedLabel : ''}
      </span>
    </>
  );
};

TerminalCopyButton.displayName = 'TerminalCopyButton';

const Terminal = Object.assign(TerminalRoot, {
  Header: TerminalHeader,
  Content: TerminalContent,
  CopyButton: TerminalCopyButton,
});

export { Terminal };
export type {
  TerminalContentProps,
  TerminalCopyButtonProps,
  TerminalHeaderProps,
  TerminalProps,
  TerminalStatus,
};
