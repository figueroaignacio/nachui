'use client';

import { CheckmarkCircleIcon, CopyIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Animation variants (hoisted for memoization) ---

const ICON_VARIANTS = {
  initial: { opacity: 0, scale: 0.6, rotate: -10 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.6, rotate: 10 },
} as const;

const ICON_TRANSITION = { duration: 0.18, ease: 'easeOut' } as const;

// --- Types ---

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  command: string;
  prefix?: string;
  resetDelay?: number;
  onCopied?: () => void;
}

// --- Component ---

export const Command = ({
  command,
  prefix = '$',
  resetDelay = 2000,
  onCopied,
  className,
  ref,
  ...props
}: CommandProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [copied, setCopied] = React.useState(false);
  const resetTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const markCopied = React.useCallback(() => {
    setCopied(true);
    onCopied?.();
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
  }, [onCopied, resetDelay]);

  const handleCopy = React.useCallback(async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(command);
      markCopied();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        markCopied();
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, [command, copied, markCopied]);

  return (
    <div
      ref={ref}
      className={cn(
        'text-foreground bg-muted/30 border-border flex w-full items-center gap-3 rounded-md border px-4 py-2.5 font-mono text-sm',
        className,
      )}
      {...props}
    >
      <span className="text-muted-foreground shrink-0 select-none" aria-hidden="true">
        {prefix}
      </span>

      <code className="flex-1 truncate text-sm select-all">{command}</code>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy command'}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        className={cn(
          'text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5 transition-colors',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
          copied && 'text-success hover:text-success',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              variants={ICON_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={ICON_TRANSITION}
              className="flex"
              aria-hidden="true"
            >
              <HugeiconsIcon icon={CheckmarkCircleIcon} size={16} className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              variants={ICON_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={ICON_TRANSITION}
              className="flex"
              aria-hidden="true"
            >
              <HugeiconsIcon icon={CopyIcon} size={16} className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
