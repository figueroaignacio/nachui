'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { springs, tap } from '../lib/motion';
import { useControllableState } from '../lib/use-controllable-state';

const toggleVariants = cva(
  'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-muted-foreground outline-none select-none transition-colors ring-offset-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 data-[state=off]:hover:bg-muted/60 data-[state=on]:bg-muted data-[state=on]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent',
      },
      size: {
        sm: 'h-8 min-w-8 px-2',
        default: 'h-9 min-w-9 px-2.5',
        lg: 'h-10 min-w-10 px-3',
      },
    },
    compoundVariants: [
      { variant: 'outline', size: 'sm', className: 'px-1.5' },
      { variant: 'outline', size: 'default', className: 'px-2' },
      { variant: 'outline', size: 'lg', className: 'px-2.5' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ToggleProps
  extends
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
    >,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  ref?: React.Ref<HTMLButtonElement>;
}

const Toggle = ({
  className,
  variant,
  size,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  disabled,
  onClick,
  ref,
  ...props
}: ToggleProps) => {
  const [pressed, setPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-slot="toggle"
      data-state={pressed ? 'on' : 'off'}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      className={cn(toggleVariants({ variant, size }), className)}
      whileTap={!disabled && !shouldReduceMotion ? tap : undefined}
      transition={springs.snappy}
      {...props}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setPressed((previous) => !previous);
      }}
    />
  );
};
Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };
export type { ToggleProps };
