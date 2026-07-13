'use client';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

// --- Animation constants ---

const POPOVER_POSITION_CLASSES = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

const POPOVER_ANIMATION_VARIANTS = {
  top: {
    initial: { opacity: 0, y: 5, scale: 0.96, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  bottom: {
    initial: { opacity: 0, y: -5, scale: 0.96, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  left: {
    initial: { opacity: 0, x: 5, scale: 0.96, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  },
  right: {
    initial: { opacity: 0, x: -5, scale: 0.96, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  },
} as const;

const POPOVER_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const;
const POPOVER_STYLE = { willChange: 'opacity, transform, filter' } as const;

// --- Context ---

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

const usePopoverContext = () => {
  const context = React.use(PopoverContext);
  if (!context) {
    throw new Error('usePopoverContext must be used within a Popover');
  }
  return context;
};

// --- Components ---

interface PopoverProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PopoverRoot = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const id = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newState: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newState);
      }
      onOpenChange?.(newState);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen]);

  return (
    <PopoverContext value={{ open, setOpen, id }}>
      <div ref={containerRef} className="relative inline-flex">
        {children}
      </div>
    </PopoverContext>
  );
};

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger = ({
  asChild,
  onClick,
  ref,
  ...props
}: PopoverTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id } = usePopoverContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
    onClick?.(e);
  };

  if (asChild) {
    return React.cloneElement(props.children as React.ReactElement<Record<string, unknown>>, {
      onClick: handleClick,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      'aria-controls': id,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      ref={ref}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-controls={id}
      {...props}
    />
  );
};
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverClose = ({
  asChild,
  onClick,
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const { setOpen } = usePopoverContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    onClick?.(e);
  };

  if (asChild) {
    return React.cloneElement(props.children as React.ReactElement<Record<string, unknown>>, {
      onClick: handleClick,
    });
  }

  return <button type="button" onClick={handleClick} ref={ref} {...props} />;
};
PopoverClose.displayName = 'PopoverClose';

interface PopoverContentProps extends HTMLMotionProps<'div'> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  children?: React.ReactNode;
  showClose?: boolean;
}

const PopoverContent = ({
  side = 'bottom',
  sideOffset = 4,
  className,
  children,
  showClose = false,
  ...props
}: PopoverContentProps) => {
  const { open, id, setOpen } = usePopoverContext();

  const sideOffsetStyle = React.useMemo(
    () => ({
      ...(side === 'top' && { marginBottom: sideOffset }),
      ...(side === 'bottom' && { marginTop: sideOffset }),
      ...(side === 'left' && { marginRight: sideOffset }),
      ...(side === 'right' && { marginLeft: sideOffset }),
      ...POPOVER_STYLE,
    }),
    [side, sideOffset],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="dialog"
          initial={POPOVER_ANIMATION_VARIANTS[side].initial}
          animate={POPOVER_ANIMATION_VARIANTS[side].animate}
          exit={POPOVER_ANIMATION_VARIANTS[side].initial}
          transition={POPOVER_TRANSITION}
          style={sideOffsetStyle}
          className={cn(
            'bg-popover text-popover-foreground absolute z-50 w-72 rounded-sm border p-4 shadow-sm outline-none',
            POPOVER_POSITION_CLASSES[side],
            className,
          )}
          {...props}
        >
          {children}
          {showClose && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ring-offset-background focus-visible:ring-ring absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" size={16} />
              <span className="sr-only">Close</span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
PopoverContent.displayName = 'PopoverContent';

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});

export { Popover };
