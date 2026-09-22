'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function CopyIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
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

const COPIED_TIMEOUT = 1500;

interface CodeBlockContextValue {
  code: string;
  lines: string[];
  language?: string;
  filename?: string;
  showLineNumbers: boolean;
  collapsible: boolean;
  maxLines: number;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  renderLine?: (line: string, index: number) => React.ReactNode;
}

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null);

const useCodeBlockContext = (): CodeBlockContextValue => {
  const context = React.use(CodeBlockContext);
  if (!context) {
    throw new Error('CodeBlock components must be used within CodeBlock');
  }
  return context;
};

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  maxLines?: number;
  renderLine?: (line: string, index: number) => React.ReactNode;
}

type CodeBlockHeaderProps = React.HTMLAttributes<HTMLDivElement>;

interface CodeBlockCopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  copyLabel?: string;
  copiedLabel?: string;
  onCopied?: (code: string) => void;
}

type CodeBlockContentProps = React.HTMLAttributes<HTMLPreElement>;

interface CodeBlockExpandProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expandLabel?: (hidden: number) => string;
  collapseLabel?: string;
}

const splitLines = (code: string): string[] => {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
};

const CodeBlockRoot = ({
  className,
  code,
  language,
  filename,
  showLineNumbers = false,
  collapsible = false,
  maxLines = 20,
  renderLine,
  children,
  ref,
  ...props
}: CodeBlockProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [expanded, setExpanded] = React.useState(false);
  const lines = React.useMemo(() => splitLines(code), [code]);

  const value = React.useMemo<CodeBlockContextValue>(
    () => ({
      code,
      lines,
      language,
      filename,
      showLineNumbers,
      collapsible,
      maxLines,
      expanded,
      setExpanded,
      renderLine,
    }),
    [code, lines, language, filename, showLineNumbers, collapsible, maxLines, expanded, renderLine],
  );

  return (
    <CodeBlockContext value={value}>
      <div
        ref={ref}
        data-language={language}
        data-state={collapsible ? (expanded ? 'expanded' : 'collapsed') : undefined}
        className={cn(
          'border-border bg-code text-foreground w-full min-w-0 overflow-hidden rounded-lg border',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CodeBlockContext>
  );
};

CodeBlockRoot.displayName = 'CodeBlock';

const CodeBlockHeader = ({
  className,
  children,
  ref,
  ...props
}: CodeBlockHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { filename, language } = useCodeBlockContext();

  return (
    <div
      ref={ref}
      className={cn(
        'border-border text-muted-foreground flex min-h-9 items-center justify-between gap-3 border-b px-3 py-1.5 font-mono text-xs',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2">
        {filename ? <span className="text-foreground truncate">{filename}</span> : null}
        {language ? <span className="shrink-0 uppercase">{language}</span> : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-1">{children}</div> : null}
    </div>
  );
};

CodeBlockHeader.displayName = 'CodeBlockHeader';

const CodeBlockCopyButton = ({
  className,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied',
  onCopied,
  onClick,
  ref,
  ...props
}: CodeBlockCopyButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { code } = useCodeBlockContext();
  const [copied, setCopied] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const label = copied ? copiedLabel : copyLabel;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      data-copied={copied ? '' : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const write = navigator.clipboard?.writeText(code);
        void Promise.resolve(write).then(() => {
          onCopied?.(code);
          setCopied(true);
          if (timeout.current) clearTimeout(timeout.current);
          timeout.current = setTimeout(() => setCopied(false), COPIED_TIMEOUT);
        });
      }}
      className={cn(
        'text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring data-[copied]:text-success-text inline-flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
    </button>
  );
};

CodeBlockCopyButton.displayName = 'CodeBlockCopyButton';

const CodeBlockContent = ({
  className,
  ref,
  ...props
}: CodeBlockContentProps & { ref?: React.Ref<HTMLPreElement> }) => {
  const { lines, language, showLineNumbers, collapsible, maxLines, expanded, renderLine } =
    useCodeBlockContext();

  const visible = collapsible && !expanded ? lines.slice(0, maxLines) : lines;
  const gutter = String(lines.length).length;

  return (
    <pre
      ref={ref}
      data-line-numbers={showLineNumbers ? '' : undefined}
      className={cn('m-0 overflow-x-auto px-3 py-3 font-mono text-[13px] leading-6', className)}
      {...props}
    >
      <code className={cn('block min-w-max', language && `language-${language}`)}>
        {visible.map((line, index) => (
          <span key={index} data-line className="flex">
            {showLineNumbers ? (
              <span
                aria-hidden="true"
                data-line-number
                className="text-muted-foreground mr-4 inline-block shrink-0 text-right select-none"
                style={{ width: `${gutter}ch` }}
              >
                {index + 1}
              </span>
            ) : null}
            <span className="whitespace-pre">{renderLine ? renderLine(line, index) : line}</span>
            {'\n'}
          </span>
        ))}
      </code>
    </pre>
  );
};

CodeBlockContent.displayName = 'CodeBlockContent';

const CodeBlockExpand = ({
  className,
  expandLabel = (hidden) => `Show ${hidden} more ${hidden === 1 ? 'line' : 'lines'}`,
  collapseLabel = 'Show less',
  onClick,
  ref,
  ...props
}: CodeBlockExpandProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { lines, collapsible, maxLines, expanded, setExpanded } = useCodeBlockContext();
  const hidden = lines.length - maxLines;

  if (!collapsible || hidden <= 0) return null;

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={expanded}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setExpanded(!expanded);
      }}
      className={cn(
        'border-border text-muted-foreground hover:text-foreground focus-visible:ring-ring flex w-full items-center justify-center gap-1.5 border-t px-3 py-1.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn('flex transition-transform', expanded && 'rotate-180')}
      >
        <ChevronDownIcon size={14} />
      </span>
      {expanded ? collapseLabel : expandLabel(hidden)}
    </button>
  );
};

CodeBlockExpand.displayName = 'CodeBlockExpand';

const CodeBlock = Object.assign(CodeBlockRoot, {
  Header: CodeBlockHeader,
  CopyButton: CodeBlockCopyButton,
  Content: CodeBlockContent,
  Expand: CodeBlockExpand,
});

export { CodeBlock };
export type {
  CodeBlockContentProps,
  CodeBlockCopyButtonProps,
  CodeBlockExpandProps,
  CodeBlockHeaderProps,
  CodeBlockProps,
};
