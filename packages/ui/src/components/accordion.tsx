'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Animation variants (hoisted at module level to avoid recreation per render) ---

const CHEVRON_VARIANTS = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
} as const;

const CHEVRON_TRANSITION = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
} as const;

const CHEVRON_STYLE = { willChange: 'transform' } as const;

const CONTENT_HEIGHT_VARIANTS = {
  open: { height: 'auto' },
  closed: { height: 0 },
} as const;

const CONTENT_HEIGHT_TRANSITION = {
  duration: 0.3,
  ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number],
} as const;

const CONTENT_FADE_VARIANTS = {
  open: { y: 0, opacity: 1, filter: 'blur(0px)' },
  closed: { y: -15, opacity: 0, filter: 'blur(6px)' },
} as const;

const CONTENT_FADE_TRANSITIONS = {
  enter: { duration: 0.35, ease: 'easeOut' },
  exit: { duration: 0.2, ease: 'easeIn' },
} as const;

const CONTENT_STYLE = { willChange: 'opacity, transform, filter' } as const;

// --- Context ---

type AccordionContextValue = {
  type: 'single' | 'multiple';
  openItems: string[];
  toggleItem: (value: string) => void;
  baseId: string;
};

const slugify = (value: string) => value.replace(/[^a-zA-Z0-9-]/gi, '');

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = React.use(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

// --- Components ---

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  children?: React.ReactNode;
  className?: string;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

const AccordionRoot = ({
  type = 'single',
  defaultValue,
  children,
  className,
  value,
  onValueChange,
  ref,
}: AccordionProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });
  const baseId = React.useId();

  const isControlled = value !== undefined;
  const openItems = isControlled ? value : uncontrolledValue;

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const updater = (prev: string[]) => {
        if (type === 'single') {
          return prev.includes(itemValue) ? [] : [itemValue];
        }
        return prev.includes(itemValue)
          ? prev.filter((v) => v !== itemValue)
          : [...prev, itemValue];
      };

      if (!isControlled) {
        setUncontrolledValue((prev) => {
          const newValue = updater(prev);
          onValueChange?.(newValue);
          return newValue;
        });
      } else {
        onValueChange?.(updater(openItems));
      }
    },
    [type, isControlled, openItems, onValueChange],
  );

  return (
    <AccordionContext value={{ type, openItems, toggleItem, baseId }}>
      <div ref={ref} data-accordion-root="" className={cn('w-full space-y-2', className)}>
        {children}
      </div>
    </AccordionContext>
  );
};

AccordionRoot.displayName = 'Accordion';

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: React.ReactNode;
}

const AccordionItem = ({
  value: _value,
  children,
  className,
  ref,
  ...props
}: AccordionItemProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('border-border overflow-hidden border-b last:border-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps {
  children?: React.ReactNode;
  value: string;
  className?: string;
}

const AccordionTrigger = ({
  children,
  value,
  className,
  ref,
}: AccordionTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { openItems, toggleItem, baseId } = useAccordionContext();
  const isOpen = openItems.includes(value);
  const shouldReduceMotion = useReducedMotion();
  const triggerId = `${baseId}-trigger-${slugify(value)}`;
  const contentId = `${baseId}-content-${slugify(value)}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;

    const root = e.currentTarget.closest<HTMLElement>('[data-accordion-root]');
    if (!root) return;

    const triggers = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'),
    );
    const currentIndex = triggers.indexOf(e.currentTarget);
    if (currentIndex < 0) return;

    e.preventDefault();
    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % triggers.length;
    else if (e.key === 'ArrowUp')
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = triggers.length - 1;

    triggers[nextIndex]?.focus();
  };

  return (
    <motion.button
      ref={ref}
      id={triggerId}
      type="button"
      data-accordion-trigger=""
      aria-controls={contentId}
      aria-expanded={isOpen}
      onClick={() => toggleItem(value)}
      onKeyDown={handleKeyDown}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      className={cn(
        'group hover:text-muted-foreground flex w-full items-center justify-between py-3.5 text-left text-sm font-medium transition-colors',
        className,
      )}
    >
      {children}
      <motion.svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-colors"
        variants={CHEVRON_VARIANTS}
        animate={shouldReduceMotion ? undefined : isOpen ? 'open' : 'closed'}
        transition={CHEVRON_TRANSITION}
        style={CHEVRON_STYLE}
      >
        <path d="m6 9 6 6 6-6" />
      </motion.svg>
    </motion.button>
  );
};

AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionContentProps {
  children?: React.ReactNode;
  value: string;
  className?: string;
}

const AccordionContent = ({
  children,
  value,
  className,
  ref,
}: AccordionContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { openItems, baseId } = useAccordionContext();
  const isOpen = openItems.includes(value);
  const triggerId = `${baseId}-trigger-${slugify(value)}`;
  const contentId = `${baseId}-content-${slugify(value)}`;

  return (
    <AnimatePresence initial={false} mode="wait">
      {isOpen && (
        <motion.div
          ref={ref}
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          key="content"
          variants={CONTENT_HEIGHT_VARIANTS}
          initial="closed"
          animate="open"
          exit="closed"
          transition={CONTENT_HEIGHT_TRANSITION}
          className={cn('overflow-hidden text-sm', className)}
        >
          <motion.div
            variants={CONTENT_FADE_VARIANTS}
            initial="closed"
            animate="open"
            exit={{ ...CONTENT_FADE_VARIANTS.closed, transition: CONTENT_FADE_TRANSITIONS.exit }}
            transition={CONTENT_FADE_TRANSITIONS.enter}
            style={CONTENT_STYLE}
            className="text-muted-foreground pt-0 pb-4"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AccordionContent.displayName = 'AccordionContent';

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export { Accordion };
export type { AccordionContentProps, AccordionItemProps, AccordionProps, AccordionTriggerProps };
