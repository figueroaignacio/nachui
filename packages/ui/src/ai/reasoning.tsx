'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function BrainIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-2 5.2A3 3 0 0 0 6 16a3 3 0 0 0 6 0Z" />
      <path d="M12 5a3 3 0 0 1 6 0 3 3 0 0 1 2 5.2A3 3 0 0 1 18 16a3 3 0 0 1-6 0Z" />
      <path d="M12 5v11" />
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

const REASONING_CONTENT_VARIANTS = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number],
      },
      opacity: { duration: 0.2, delay: 0.04 },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] },
      opacity: { duration: 0.12 },
    },
  },
} as const;

const PULSE_ANIMATE = { opacity: [0.4, 1, 0.4] };
const PULSE_TRANSITION = { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } as const;
const CHEVRON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
  id: string;
}

const ReasoningContext = React.createContext<ReasoningContextValue | null>(null);

const useReasoning = (): ReasoningContextValue => {
  const context = React.use(ReasoningContext);
  if (!context) {
    throw new Error('Reasoning components must be used within Reasoning');
  }
  return context;
};

interface ReasoningProps extends React.HTMLAttributes<HTMLDivElement> {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
}

interface ReasoningTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  getLabel?: (isStreaming: boolean, duration?: number) => React.ReactNode;
}

type ReasoningContentProps = React.HTMLAttributes<HTMLDivElement>;

const defaultLabel = (isStreaming: boolean, duration?: number): React.ReactNode => {
  if (isStreaming) return 'Thinking';
  if (duration === undefined) return 'Reasoning';
  return `Thought for ${duration} second${duration === 1 ? '' : 's'}`;
};

const ReasoningRoot = ({
  className,
  isStreaming = false,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  duration: controlledDuration,
  children,
  ref,
  ...props
}: ReasoningProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [trackedDuration, setTrackedDuration] = React.useState<number | undefined>(undefined);
  const startedAt = React.useRef<number | null>(null);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const id = React.useId();

  const setIsOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (isStreaming) {
      startedAt.current = Date.now();
      setTrackedDuration(undefined);
      setIsOpen(true);
      return;
    }

    if (startedAt.current !== null) {
      setTrackedDuration(Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
      startedAt.current = null;
      setIsOpen(false);
    }
  }, [isStreaming, setIsOpen]);

  const duration = controlledDuration ?? trackedDuration;

  const value = React.useMemo<ReasoningContextValue>(
    () => ({ isStreaming, isOpen, setIsOpen, duration, id }),
    [isStreaming, isOpen, setIsOpen, duration, id],
  );

  return (
    <ReasoningContext value={value}>
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        data-streaming={isStreaming ? '' : undefined}
        className={cn('flex w-full flex-col gap-1', className)}
        {...props}
      >
        {children}
      </div>
    </ReasoningContext>
  );
};

ReasoningRoot.displayName = 'Reasoning';

const ReasoningTrigger = ({
  className,
  getLabel = defaultLabel,
  children,
  onClick,
  ref,
  ...props
}: ReasoningTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { isStreaming, isOpen, setIsOpen, duration, id } = useReasoning();
  const shouldReduceMotion = useReducedMotion();

  const label = children ?? getLabel(isStreaming, duration);

  return (
    <button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      aria-expanded={isOpen}
      aria-controls={`${id}-content`}
      onClick={(event) => {
        setIsOpen(!isOpen);
        onClick?.(event);
      }}
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring flex w-fit items-center gap-1.5 rounded-md text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <BrainIcon size={15} className="shrink-0" />
      {isStreaming && !shouldReduceMotion ? (
        <motion.span animate={PULSE_ANIMATE} transition={PULSE_TRANSITION}>
          {label}
        </motion.span>
      ) : (
        <span>{label}</span>
      )}
      <motion.span
        aria-hidden="true"
        className="flex shrink-0"
        animate={shouldReduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
        transition={CHEVRON_TRANSITION}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
    </button>
  );
};

ReasoningTrigger.displayName = 'ReasoningTrigger';

const ReasoningContent = ({
  className,
  children,
  ref,
  ...props
}: ReasoningContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { isOpen, id } = useReasoning();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={REASONING_CONTENT_VARIANTS}
          initial="closed"
          animate="open"
          exit="closed"
          className="overflow-hidden"
        >
          <div
            className={cn(
              'border-border text-muted-foreground mt-1 ml-[7px] border-l pl-4 text-sm leading-relaxed',
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ReasoningContent.displayName = 'ReasoningContent';

const Reasoning = Object.assign(ReasoningRoot, {
  Trigger: ReasoningTrigger,
  Content: ReasoningContent,
});

export { Reasoning, useReasoning };
export type { ReasoningContentProps, ReasoningProps, ReasoningTriggerProps };
