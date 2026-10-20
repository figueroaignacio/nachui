import type { VariantProps } from 'class-variance-authority';
import React from 'react';
import { Flex, type flexVariants } from './flex';

type StackOwnProps<E extends React.ElementType> = Omit<
  VariantProps<typeof flexVariants>,
  'direction'
> & {
  as?: E;
  className?: string;
  direction?: 'column' | 'row';
};

type StackProps<E extends React.ElementType = 'div'> = StackOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof StackOwnProps<E>>;

const Stack = <E extends React.ElementType = 'div'>({
  as,
  direction = 'column',
  ...props
}: StackProps<E>) => {
  const Component: React.ElementType = as ?? 'div';
  return <Flex as={Component} direction={direction} {...props} />;
};

Stack.displayName = 'Stack';

export { Stack };
export type { StackProps };
