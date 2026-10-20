import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

const flexVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
    },
    gap: {
      '0': 'gap-0',
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '5': 'gap-5',
      '6': 'gap-6',
      '8': 'gap-8',
      '10': 'gap-10',
      '12': 'gap-12',
      '16': 'gap-16',
      '20': 'gap-20',
      '24': 'gap-24',
      '32': 'gap-32',
    },
  },
  defaultVariants: {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: 'nowrap',
  },
});

type FlexOwnProps<E extends React.ElementType> = VariantProps<typeof flexVariants> & {
  as?: E;
  className?: string;
};

type FlexProps<E extends React.ElementType = 'div'> = FlexOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof FlexOwnProps<E>>;

const Flex = <E extends React.ElementType = 'div'>({
  as,
  direction,
  align,
  justify,
  wrap,
  gap,
  className,
  ...props
}: FlexProps<E>) => {
  const Component: React.ElementType = as ?? 'div';
  return (
    <Component
      className={cn(flexVariants({ direction, align, justify, wrap, gap }), className)}
      {...props}
    />
  );
};

Flex.displayName = 'Flex';

export { Flex, flexVariants };
export type { FlexProps };
