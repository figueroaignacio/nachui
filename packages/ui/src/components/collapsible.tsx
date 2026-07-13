'use client';

import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva } from 'class-variance-authority';
import { AnimatePresence, HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Animation constants (module level) ---

const COLLAPSIBLE_ICON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;

const COLLAPSIBLE_HEIGHT_VARIANTS = {
  open: {
    height: 'auto',
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] },
      opacity: { duration: 0.25, delay: 0.05 },
      filter: { duration: 0.3 },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
      height: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number],
      },
      opacity: { duration: 0.15 },
      filter: { duration: 0.2 },
    },
  },
} as const;

const COLLAPSIBLE_INNER_VARIANTS = {
  open: { y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  closed: { y: -8, scale: 0.98, transition: { duration: 0.2 } },
} as const;

const COLLAPSIBLE_CONTENT_STYLE = { willChange: 'height, opacity, filter' } as const;

// --- CVA ---

const collapsibleVariants = cva('', {
  variants: {
    variant: {
      default: '',
      bordered: 'rounded-sm border border-border',
      card: 'rounded-sm border border-border bg-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const collapsibleTriggerVariants = cva(
  [
    'flex w-full items-center justify-between',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'hover:opacity-80',
        bordered: 'p-4 hover:bg-muted/50',
        card: 'p-4 hover:bg-muted/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const collapsibleContentVariants = cva('overflow-hidden', {
  variants: {
    variant: {
      default: '',
      bordered: 'px-4 pb-4',
      card: 'px-4 pb-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// --- Context ---

interface CollapsibleContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  disabled?: boolean;
  variant?: 'default' | 'bordered' | 'card';
  id: string;
}

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  variant?: 'default' | 'bordered' | 'card';
}

interface CollapsibleTriggerProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  showChevron?: boolean;
  chevronIcon?: React.ReactNode;
  chevronPosition?: 'left' | 'right';
  asChild?: boolean;
  children?: React.ReactNode;
}

interface CollapsibleContentProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  forceMount?: boolean;
  children?: React.ReactNode;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

const useCollapsibleContext = (): CollapsibleContextValue => {
  const context = React.use(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be used within Collapsible');
  }
  return context;
};

// --- Components ---

const CollapsibleRoot = ({
  className,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  variant = 'default',
  children,
  ref,
  ...props
}: CollapsibleProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = React.useCallback(
    (open: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalOpen(open);
      }
      onOpenChange?.(open);
    },
    [disabled, isControlled, onOpenChange],
  );

  const id = React.useId();

  const contextValue = React.useMemo<CollapsibleContextValue>(
    () => ({ isOpen, setIsOpen, disabled, variant, id }),
    [isOpen, setIsOpen, disabled, variant, id],
  );

  return (
    <CollapsibleContext value={contextValue}>
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        className={cn(collapsibleVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext>
  );
};

CollapsibleRoot.displayName = 'Collapsible';

const CollapsibleTrigger = ({
  className,
  showChevron = true,
  chevronIcon,
  chevronPosition = 'right',
  asChild = false,
  children,
  onClick,
  ref,
  ...props
}: CollapsibleTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { isOpen, setIsOpen, disabled, variant, id } = useCollapsibleContext();
  const shouldReduceMotion = useReducedMotion();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setIsOpen(!isOpen);
        onClick?.(e);
      }
    },
    [disabled, isOpen, setIsOpen, onClick],
  );

  const chevron = chevronIcon ?? (
    <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 shrink-0" size={16} />
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      'data-state': isOpen ? 'open' : 'closed',
      'aria-expanded': isOpen,
      'aria-controls': `${id}-content`,
      disabled,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      onClick={handleClick}
      disabled={disabled}
      data-state={isOpen ? 'open' : 'closed'}
      aria-expanded={isOpen}
      aria-controls={`${id}-content`}
      whileHover={!disabled && !shouldReduceMotion ? { scale: 1.005 } : undefined}
      whileTap={!disabled && !shouldReduceMotion ? { scale: 0.99 } : undefined}
      className={cn(collapsibleTriggerVariants({ variant }), className)}
      {...props}
    >
      {showChevron && chevronPosition === 'left' && (
        <motion.span
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: isOpen ? 90 : 0 }}
          transition={COLLAPSIBLE_ICON_TRANSITION}
          className="mr-2"
        >
          {chevron}
        </motion.span>
      )}
      <span className="flex-1 text-left">{children}</span>
      {showChevron && chevronPosition === 'right' && (
        <motion.span
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
          transition={COLLAPSIBLE_ICON_TRANSITION}
          className="ml-2"
        >
          {chevron}
        </motion.span>
      )}
    </motion.button>
  );
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = ({
  className,
  forceMount = false,
  children,
  ref,
  ...props
}: CollapsibleContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { isOpen, variant, id } = useCollapsibleContext();

  return (
    <AnimatePresence initial={false} mode="sync">
      {(isOpen || forceMount) && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={COLLAPSIBLE_HEIGHT_VARIANTS}
          initial="closed"
          animate="open"
          exit="closed"
          style={COLLAPSIBLE_CONTENT_STYLE}
          className={cn(collapsibleContentVariants({ variant }), className)}
          {...props}
        >
          <motion.div
            variants={COLLAPSIBLE_INNER_VARIANTS}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

CollapsibleContent.displayName = 'CollapsibleContent';

const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
});

export { Collapsible, collapsibleContentVariants, collapsibleTriggerVariants, collapsibleVariants };

export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps };
