'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import React from 'react';
import { cn } from '../lib/cn';
import { springs, tap } from '../lib/motion';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function LoaderIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M21.5 12A9.5 9.5 0 1 1 12 2.5" />
    </svg>
  );
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none select-none relative overflow-hidden ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-invalid:ring-1 aria-invalid:ring-destructive/50 aria-invalid:border-destructive transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border-border border bg-transparent hover:bg-muted text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted text-foreground',
        link: 'text-foreground underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6 text-base',
        icon: 'size-9',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto p-0' }],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const LOADER_VARIANTS = {
  initial: { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
} as const;

const CONTENT_VARIANTS = {
  initial: { opacity: 0, y: 5, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -5, filter: 'blur(4px)' },
} as const;

const REDUCED_SWAP_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const SWAP_TRANSITION = { duration: 0.2 } as const;
const BUTTON_STYLE = { willChange: 'transform' } as const;

interface ButtonProps extends HTMLMotionProps<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loader?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const ButtonRoot = ({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  loader,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  type = 'button',
  onClick,
  ref,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={loading && !disabled ? true : undefined}
      aria-busy={loading}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
      whileTap={!isDisabled && !shouldReduceMotion ? tap : undefined}
      transition={springs.snappy}
      style={BUTTON_STYLE}
      {...props}
    >
      <motion.span
        className="flex items-center gap-2"
        variants={shouldReduceMotion ? REDUCED_SWAP_VARIANTS : CONTENT_VARIANTS}
        initial={false}
        animate={loading ? 'exit' : 'animate'}
        transition={SWAP_TRANSITION}
      >
        {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
        <span>{children}</span>
        {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </motion.span>
      <AnimatePresence initial={false}>
        {loading ? (
          <motion.span
            key="loader"
            variants={shouldReduceMotion ? REDUCED_SWAP_VARIANTS : LOADER_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={SWAP_TRANSITION}
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            {loader ?? (
              <LoaderIcon className="size-4 animate-spin motion-reduce:animate-none" size={16} />
            )}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
};

ButtonRoot.displayName = 'Button';

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const ButtonGroup = ({
  className,
  children,
  orientation = 'horizontal',
  attached = false,
  ref,
  ...props
}: ButtonGroupProps) => {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        attached
          ? orientation === 'horizontal'
            ? '[&>button:not(:first-child)]:-ml-px [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none'
            : '[&>button:not(:first-child)]:-mt-px [&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none'
          : 'gap-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

const Button = Object.assign(ButtonRoot, {
  Group: ButtonGroup,
});

export { Button, buttonVariants };
export type { ButtonGroupProps, ButtonProps };
