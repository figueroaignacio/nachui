import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

const centerVariants = cva('', {
  variants: {
    axis: {
      both: 'items-center justify-center',
      horizontal: 'justify-center',
      vertical: 'items-center',
    },
    inline: {
      true: 'inline-flex',
      false: 'flex',
    },
    text: {
      true: 'text-center',
      false: '',
    },
  },
  defaultVariants: {
    axis: 'both',
    inline: false,
    text: false,
  },
});

type CenterOwnProps<E extends React.ElementType> = VariantProps<typeof centerVariants> & {
  as?: E;
  className?: string;
};

type CenterProps<E extends React.ElementType = 'div'> = CenterOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof CenterOwnProps<E>>;

const Center = <E extends React.ElementType = 'div'>({
  as,
  axis,
  inline,
  text,
  className,
  ...props
}: CenterProps<E>) => {
  const Component: React.ElementType = as ?? 'div';
  return (
    <Component
      data-slot="center"
      className={cn(centerVariants({ axis, inline, text }), className)}
      {...props}
    />
  );
};

Center.displayName = 'Center';

export { Center, centerVariants };
export type { CenterProps };
