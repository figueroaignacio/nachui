'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

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

const SCROLL_BUTTON_VARIANTS = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 26 },
  },
  exit: { opacity: 0, y: 6, scale: 0.94, transition: { duration: 0.12 } },
} as const;

const BOTTOM_THRESHOLD = 8;

interface ConversationContextValue {
  stuck: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

const ConversationContext = React.createContext<ConversationContextValue | null>(null);

const useConversationContext = (): ConversationContextValue => {
  const context = React.use(ConversationContext);
  if (!context) {
    throw new Error('Conversation components must be used within Conversation');
  }
  return context;
};

const useConversation = (): ConversationContextValue => useConversationContext();

interface ConversationProps extends React.HTMLAttributes<HTMLDivElement> {
  stickToBottom?: boolean;
  onStickChange?: (stuck: boolean) => void;
}

type ConversationContentProps = React.HTMLAttributes<HTMLDivElement>;

interface ConversationScrollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

type ConversationEmptyProps = React.HTMLAttributes<HTMLDivElement>;

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const isAtBottom = (element: HTMLElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight <= BOTTOM_THRESHOLD;

const ConversationRoot = ({
  className,
  stickToBottom = true,
  onStickChange,
  children,
  onScroll,
  ref,
  ...props
}: ConversationProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [stuck, setStuckState] = React.useState(true);
  const stuckRef = React.useRef(true);
  const onStickChangeRef = React.useRef(onStickChange);
  onStickChangeRef.current = onStickChange;

  const setStuck = React.useCallback((next: boolean) => {
    if (stuckRef.current === next) return;
    stuckRef.current = next;
    setStuckState(next);
    onStickChangeRef.current?.(next);
  }, []);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const element = scrollRef.current;
      if (!element) return;
      if (typeof element.scrollTo === 'function') {
        element.scrollTo({ top: element.scrollHeight, behavior });
      } else {
        element.scrollTop = element.scrollHeight;
      }
      setStuck(true);
    },
    [setStuck],
  );

  useIsomorphicLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element || !stickToBottom) return;

    const pin = () => {
      if (stuckRef.current) {
        element.scrollTop = element.scrollHeight;
      }
    };

    pin();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(pin);
    observer.observe(element);
    for (const child of Array.from(element.children)) {
      observer.observe(child);
    }

    const mutation =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver((records) => {
            for (const record of records) {
              for (const node of Array.from(record.addedNodes)) {
                if (node instanceof Element) observer.observe(node);
              }
            }
            pin();
          });
    mutation?.observe(element, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      mutation?.disconnect();
    };
  }, [stickToBottom]);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const value = React.useMemo<ConversationContextValue>(
    () => ({ stuck, scrollToBottom }),
    [stuck, scrollToBottom],
  );

  return (
    <ConversationContext value={value}>
      <div
        ref={setRefs}
        role="log"
        aria-live="polite"
        data-stuck={stuck ? 'true' : 'false'}
        onScroll={(event) => {
          setStuck(isAtBottom(event.currentTarget));
          onScroll?.(event);
        }}
        className={cn('relative min-h-0 w-full overflow-y-auto overscroll-contain', className)}
        {...props}
      >
        {children}
      </div>
    </ConversationContext>
  );
};

ConversationRoot.displayName = 'Conversation';

const ConversationContent = ({
  className,
  ref,
  ...props
}: ConversationContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex w-full flex-col gap-4 p-4', className)} {...props} />;
};

ConversationContent.displayName = 'ConversationContent';

const ConversationScrollButton = ({
  className,
  label = 'Scroll to bottom',
  onClick,
  children,
  ref,
  ...props
}: ConversationScrollButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { stuck, scrollToBottom } = useConversationContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {!stuck && (
        <motion.div
          className="pointer-events-none sticky bottom-3 z-10 flex w-full justify-center"
          variants={shouldReduceMotion ? undefined : SCROLL_BUTTON_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            ref={ref}
            type="button"
            aria-label={label}
            onClick={(event) => {
              scrollToBottom();
              onClick?.(event);
            }}
            className={cn(
              'border-border bg-background text-muted-foreground hover:text-foreground focus-visible:ring-ring pointer-events-auto flex size-8 items-center justify-center rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
              className,
            )}
            {...props}
          >
            {children ?? <ChevronDownIcon size={16} />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ConversationScrollButton.displayName = 'ConversationScrollButton';

const ConversationEmpty = ({
  className,
  ref,
  ...props
}: ConversationEmptyProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'text-muted-foreground flex h-full min-h-40 w-full flex-col items-center justify-center gap-1 p-6 text-center text-sm',
        className,
      )}
      {...props}
    />
  );
};

ConversationEmpty.displayName = 'ConversationEmpty';

const Conversation = Object.assign(ConversationRoot, {
  Content: ConversationContent,
  ScrollButton: ConversationScrollButton,
  Empty: ConversationEmpty,
});

export { Conversation, useConversation };
export type {
  ConversationContentProps,
  ConversationEmptyProps,
  ConversationProps,
  ConversationScrollButtonProps,
};
