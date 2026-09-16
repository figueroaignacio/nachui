'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function CheckCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12 2.7 2.7L16 9.3" />
    </svg>
  );
}

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
      <rect x="8.5" y="8.5" width="12.5" height="12.5" rx="3" />
      <path d="M5.5 15.5h-.5a2.5 2.5 0 0 1-2.5-2.5V5.5A2.5 2.5 0 0 1 5 3h7.5A2.5 2.5 0 0 1 15 5.5V6" />
    </svg>
  );
}

// --- Animation variants (hoisted for memoization) ---

const ICON_VARIANTS = {
  initial: { opacity: 0, scale: 0.6, rotate: -10 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.6, rotate: 10 },
} as const;

const ICON_TRANSITION = { duration: 0.18, ease: 'easeOut' } as const;
const REDUCED_MOTION_PROPS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
} as const;

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
  const shouldReduceMotion = useReducedMotion();
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
              initial={shouldReduceMotion ? REDUCED_MOTION_PROPS.initial : ICON_VARIANTS.initial}
              animate={shouldReduceMotion ? REDUCED_MOTION_PROPS.animate : ICON_VARIANTS.animate}
              exit={shouldReduceMotion ? REDUCED_MOTION_PROPS.exit : ICON_VARIANTS.exit}
              transition={shouldReduceMotion ? REDUCED_MOTION_PROPS.transition : ICON_TRANSITION}
              className="flex"
              aria-hidden="true"
            >
              <CheckCircleIcon size={16} className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={shouldReduceMotion ? REDUCED_MOTION_PROPS.initial : ICON_VARIANTS.initial}
              animate={shouldReduceMotion ? REDUCED_MOTION_PROPS.animate : ICON_VARIANTS.animate}
              exit={shouldReduceMotion ? REDUCED_MOTION_PROPS.exit : ICON_VARIANTS.exit}
              transition={shouldReduceMotion ? REDUCED_MOTION_PROPS.transition : ICON_TRANSITION}
              className="flex"
              aria-hidden="true"
            >
              <CopyIcon size={16} className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
