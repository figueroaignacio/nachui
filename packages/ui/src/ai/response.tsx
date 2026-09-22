'use client';

import { useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { Shimmer } from './shimmer';

interface ResponseContextValue {
  isStreaming: boolean;
}

const ResponseContext = React.createContext<ResponseContextValue>({ isStreaming: false });

interface ResponseProps extends React.HTMLAttributes<HTMLDivElement> {
  isStreaming?: boolean;
}

type ResponseContentProps = React.HTMLAttributes<HTMLDivElement>;
type ResponseCaretProps = React.HTMLAttributes<HTMLSpanElement>;

interface ResponseSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: string[];
}

const PROSE =
  'text-foreground text-sm leading-relaxed ' +
  '[&>p]:mb-3 [&>p:last-child]:mb-0 ' +
  '[&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:tracking-tight ' +
  '[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-[15px] [&_h2]:font-semibold [&_h2]:tracking-tight ' +
  '[&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-medium ' +
  '[&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1 ' +
  '[&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 ' +
  '[&_a]:underline [&_a]:underline-offset-4 ' +
  '[&_strong]:font-semibold ' +
  '[&_blockquote]:border-border [&_blockquote]:text-muted-foreground [&_blockquote]:mb-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 ' +
  '[&_:not(pre)>code]:bg-secondary [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em] ' +
  '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0';

const ResponseRoot = ({
  className,
  isStreaming = false,
  children,
  ref,
  ...props
}: ResponseProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const value = React.useMemo<ResponseContextValue>(() => ({ isStreaming }), [isStreaming]);

  return (
    <ResponseContext value={value}>
      <div
        ref={ref}
        data-streaming={isStreaming ? '' : undefined}
        aria-busy={isStreaming || undefined}
        className={cn('w-full min-w-0', PROSE, className)}
        {...props}
      >
        {children}
        {isStreaming ? <ResponseCaret /> : null}
      </div>
    </ResponseContext>
  );
};

ResponseRoot.displayName = 'Response';

const ResponseContent = ({
  className,
  ref,
  ...props
}: ResponseContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('contents', className)} {...props} />;
};

ResponseContent.displayName = 'ResponseContent';

const ResponseCaret = ({
  className,
  ref,
  ...props
}: ResponseCaretProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-response-caret
      className={cn(
        'bg-foreground ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] rounded-full align-baseline',
        !shouldReduceMotion && 'animate-pulse',
        className,
      )}
      {...props}
    />
  );
};

ResponseCaret.displayName = 'ResponseCaret';

const SKELETON_LINES = [
  'Reading the question and what came before it',
  'Pulling the parts of the answer together',
  'Writing it down',
];

const ResponseSkeleton = ({
  className,
  lines = SKELETON_LINES,
  ref,
  ...props
}: ResponseSkeletonProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      role="status"
      data-response-skeleton
      className={cn('flex w-full flex-col gap-1.5 text-sm', className)}
      {...props}
    >
      {lines.map((line, index) => (
        <Shimmer key={index} duration={2 + index * 0.4}>
          {line}
        </Shimmer>
      ))}
    </div>
  );
};

ResponseSkeleton.displayName = 'ResponseSkeleton';

const Response = Object.assign(ResponseRoot, {
  Content: ResponseContent,
  Caret: ResponseCaret,
  Skeleton: ResponseSkeleton,
});

export { Response };
export type { ResponseCaretProps, ResponseContentProps, ResponseProps, ResponseSkeletonProps };
