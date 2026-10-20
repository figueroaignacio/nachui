import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

const containerVariants = cva('w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      fluid: 'max-w-full',
    },
    align: {
      start: 'ms-0 me-auto',
      left: 'ms-0 me-auto',
      center: 'mx-auto',
      end: 'ms-auto me-0',
      right: 'ms-auto me-0',
    },
  },
  defaultVariants: {
    size: 'xl',
    align: 'center',
  },
});

type ContainerOwnProps<E extends React.ElementType> = VariantProps<typeof containerVariants> & {
  as?: E;
  className?: string;
};

type ContainerProps<E extends React.ElementType = 'div'> = ContainerOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof ContainerOwnProps<E>>;

const Container = <E extends React.ElementType = 'div'>({
  as,
  size,
  align,
  className,
  ...props
}: ContainerProps<E>) => {
  const Component: React.ElementType = as ?? 'div';
  return <Component className={cn(containerVariants({ size, align }), className)} {...props} />;
};

Container.displayName = 'Container';

export { Container, containerVariants };
export type { ContainerProps };
