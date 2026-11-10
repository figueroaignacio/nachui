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

function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

const COPIED_TIMEOUT = 1500;

interface StackFrame {
  fn?: string;
  file: string;
  line?: number;
  column?: number;
  internal?: boolean;
}

interface ParsedStack {
  name: string;
  message: string;
  frames: StackFrame[];
}

const V8_FRAME = /^\s*at (?:(.+?) \()?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;
const GECKO_FRAME = /^([^\s@]*)@(\S+?)(?::(\d+))?(?::(\d+))?$/;
const INTERNAL_FILE = /(?:node_modules|^node:|^internal\/|^native$|<anonymous>)/;

function isInternal(file: string) {
  return INTERNAL_FILE.test(file);
}

function parseFrame(line: string): StackFrame | null {
  const pattern = /^\s*at /.test(line) ? V8_FRAME : GECKO_FRAME;
  const match = pattern.exec(line);
  if (!match) return null;
  const [, fn, file, lineNumber, column] = match;
  if (!file || (pattern === GECKO_FRAME && !lineNumber)) return null;
  return {
    fn: fn ? fn.replace(/^async /, '') : undefined,
    file,
    line: lineNumber ? Number(lineNumber) : undefined,
    column: column ? Number(column) : undefined,
    internal: isInternal(file),
  };
}

function parseStack(stack: string): ParsedStack {
  const lines = stack.replace(/\r\n/g, '\n').split('\n');
  const head: string[] = [];
  const frames: StackFrame[] = [];

  for (const line of lines) {
    const frame = parseFrame(line);
    if (frame) {
      frames.push(frame);
    } else if (frames.length === 0 && line.trim() !== '') {
      head.push(line);
    }
  }

  const headline = head.join('\n');
  const match = /^([A-Za-z_$][\w$]*):\s?([\s\S]*)$/.exec(headline);
  return {
    name: match?.[1] ?? 'Error',
    message: match ? (match[2] ?? '') : headline,
    frames,
  };
}

function formatLocation(frame: StackFrame) {
  return [frame.file, frame.line, frame.column].filter((part) => part !== undefined).join(':');
}

interface StackTraceContextValue extends ParsedStack {
  raw: string;
}

const StackTraceContext = React.createContext<StackTraceContextValue | null>(null);

const useStackTraceContext = (): StackTraceContextValue => {
  const context = React.use(StackTraceContext);
  if (!context) {
    throw new Error('StackTrace components must be used within StackTrace');
  }
  return context;
};

interface StackTraceProps extends React.HTMLAttributes<HTMLDivElement> {
  stack?: string;
  name?: string;
  message?: string;
  frames?: StackFrame[];
}

type StackTraceHeaderProps = React.HTMLAttributes<HTMLDivElement>;

interface StackTraceFramesProps extends React.HTMLAttributes<HTMLDivElement> {
  onFrameSelect?: (frame: StackFrame) => void;
  defaultShowInternal?: boolean;
  showInternalLabel?: (count: number) => string;
  hideInternalLabel?: string;
  label?: string;
}

interface StackTraceCopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  copyLabel?: string;
  copiedLabel?: string;
  failedLabel?: string;
  onCopied?: (stack: string) => void;
}

const StackTraceRoot = ({
  className,
  stack,
  name,
  message,
  frames,
  children,
  ref,
  ...props
}: StackTraceProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const value = React.useMemo<StackTraceContextValue>(() => {
    const parsed = stack ? parseStack(stack) : { name: 'Error', message: '', frames: [] };
    const resolvedFrames = (frames ?? parsed.frames).map((frame) => ({
      ...frame,
      internal: frame.internal ?? isInternal(frame.file),
    }));
    const resolvedName = name ?? parsed.name;
    const resolvedMessage = message ?? parsed.message;
    const raw =
      stack ??
      [
        `${resolvedName}: ${resolvedMessage}`,
        ...resolvedFrames.map(
          (frame) =>
            `    at ${frame.fn ? `${frame.fn} (${formatLocation(frame)})` : formatLocation(frame)}`,
        ),
      ].join('\n');
    return { name: resolvedName, message: resolvedMessage, frames: resolvedFrames, raw };
  }, [stack, name, message, frames]);

  return (
    <StackTraceContext value={value}>
      <div
        ref={ref}
        data-slot="stack-trace"
        className={cn(
          'border-destructive-border bg-card text-card-foreground w-full min-w-0 overflow-hidden rounded-lg border',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </StackTraceContext>
  );
};

StackTraceRoot.displayName = 'StackTrace';

const StackTraceHeader = ({
  className,
  children,
  ref,
  ...props
}: StackTraceHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { name, message } = useStackTraceContext();

  return (
    <div
      ref={ref}
      data-slot="stack-trace-header"
      className={cn(
        'bg-destructive-surface border-destructive-border flex items-start gap-2.5 border-b py-2.5 ps-3 pe-1.5',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-destructive-text mt-0.5 flex shrink-0">
        <AlertIcon size={14} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-destructive-text font-mono text-xs font-medium">{name}</span>
        {message ? (
          <span className="text-foreground text-sm leading-relaxed break-words">{message}</span>
        ) : null}
      </span>
      {children}
    </div>
  );
};

StackTraceHeader.displayName = 'StackTraceHeader';

const StackTraceFrames = ({
  className,
  onFrameSelect,
  defaultShowInternal = false,
  showInternalLabel = (count) => `Show ${count} internal ${count === 1 ? 'frame' : 'frames'}`,
  hideInternalLabel = 'Hide internal frames',
  label = 'Stack frames',
  ref,
  ...props
}: StackTraceFramesProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { frames } = useStackTraceContext();
  const [showInternal, setShowInternal] = React.useState(defaultShowInternal);
  const internalCount = frames.filter((frame) => frame.internal).length;
  const visible = showInternal ? frames : frames.filter((frame) => !frame.internal);

  if (frames.length === 0) return null;

  return (
    <div
      ref={ref}
      data-slot="stack-trace-frames"
      className={cn('flex flex-col p-1.5', className)}
      {...props}
    >
      <ol aria-label={label} className="flex flex-col">
        {visible.map((frame, index) => {
          const location = formatLocation(frame);
          const slash = frame.file.lastIndexOf('/');
          const body = (
            <>
              <span
                className={cn(
                  'shrink-0 truncate',
                  frame.internal ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                {frame.fn ?? '<anonymous>'}
              </span>
              <span
                className="text-muted-foreground flex min-w-0 flex-1 justify-end"
                title={location}
              >
                {slash >= 0 ? (
                  <span className="min-w-0 truncate">{location.slice(0, slash + 1)}</span>
                ) : null}
                <span className="shrink-0">{location.slice(slash + 1)}</span>
              </span>
            </>
          );

          return (
            <li
              key={`${location}-${index}`}
              data-slot="stack-trace-frame"
              data-internal={frame.internal ? '' : undefined}
            >
              {onFrameSelect && !frame.internal ? (
                <button
                  type="button"
                  onClick={() => onFrameSelect(frame)}
                  className="hover:bg-muted/60 focus-visible:ring-ring flex w-full items-center gap-3 rounded-md px-1.5 py-1 text-start font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none pointer-coarse:py-2"
                >
                  {body}
                </button>
              ) : (
                <span className="flex items-center gap-3 px-1.5 py-1 font-mono text-xs">
                  {body}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {internalCount > 0 ? (
        <button
          type="button"
          aria-expanded={showInternal}
          data-slot="stack-trace-internal-toggle"
          onClick={() => setShowInternal(!showInternal)}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring self-start rounded-md px-1.5 py-1 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {showInternal ? hideInternalLabel : showInternalLabel(internalCount)}
        </button>
      ) : null}
    </div>
  );
};

StackTraceFrames.displayName = 'StackTraceFrames';

const StackTraceCopyButton = ({
  className,
  copyLabel = 'Copy stack trace',
  copiedLabel = 'Copied',
  failedLabel = 'Copy failed',
  onCopied,
  onClick,
  ref,
  ...props
}: StackTraceCopyButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { raw } = useStackTraceContext();
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
        data-slot="stack-trace-copy-button"
        data-copied={copied ? '' : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (!navigator.clipboard?.writeText) {
            settle('failed');
            return;
          }
          navigator.clipboard.writeText(raw).then(
            () => {
              onCopied?.(raw);
              settle('copied');
            },
            () => settle('failed'),
          );
        }}
        className={cn(
          'text-destructive-text/80 hover:bg-destructive-border/40 hover:text-destructive-text focus-visible:ring-ring data-[copied]:text-success-text inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none pointer-coarse:size-9',
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

StackTraceCopyButton.displayName = 'StackTraceCopyButton';

const StackTrace = Object.assign(StackTraceRoot, {
  Header: StackTraceHeader,
  Frames: StackTraceFrames,
  CopyButton: StackTraceCopyButton,
});

export { parseStack, StackTrace };
export type {
  ParsedStack,
  StackFrame,
  StackTraceCopyButtonProps,
  StackTraceFramesProps,
  StackTraceHeaderProps,
  StackTraceProps,
};
