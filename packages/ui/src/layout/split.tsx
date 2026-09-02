import React from 'react';
import { cn } from '../lib/cn';

const SPLIT_COLUMNS = {
  none: {
    '1/2': 'grid-cols-2',
    '1/3': 'grid-cols-[1fr_2fr]',
    '2/3': 'grid-cols-[2fr_1fr]',
    '1/4': 'grid-cols-[1fr_3fr]',
    '3/4': 'grid-cols-[3fr_1fr]',
    auto: 'grid-cols-[auto_1fr]',
    'auto-end': 'grid-cols-[1fr_auto]',
  },
  sm: {
    '1/2': 'sm:grid-cols-2',
    '1/3': 'sm:grid-cols-[1fr_2fr]',
    '2/3': 'sm:grid-cols-[2fr_1fr]',
    '1/4': 'sm:grid-cols-[1fr_3fr]',
    '3/4': 'sm:grid-cols-[3fr_1fr]',
    auto: 'sm:grid-cols-[auto_1fr]',
    'auto-end': 'sm:grid-cols-[1fr_auto]',
  },
  md: {
    '1/2': 'md:grid-cols-2',
    '1/3': 'md:grid-cols-[1fr_2fr]',
    '2/3': 'md:grid-cols-[2fr_1fr]',
    '1/4': 'md:grid-cols-[1fr_3fr]',
    '3/4': 'md:grid-cols-[3fr_1fr]',
    auto: 'md:grid-cols-[auto_1fr]',
    'auto-end': 'md:grid-cols-[1fr_auto]',
  },
  lg: {
    '1/2': 'lg:grid-cols-2',
    '1/3': 'lg:grid-cols-[1fr_2fr]',
    '2/3': 'lg:grid-cols-[2fr_1fr]',
    '1/4': 'lg:grid-cols-[1fr_3fr]',
    '3/4': 'lg:grid-cols-[3fr_1fr]',
    auto: 'lg:grid-cols-[auto_1fr]',
    'auto-end': 'lg:grid-cols-[1fr_auto]',
  },
} as const;

const SPLIT_REVERSE = {
  none: '',
  sm: '[&>*:first-child]:order-last sm:[&>*:first-child]:order-none',
  md: '[&>*:first-child]:order-last md:[&>*:first-child]:order-none',
  lg: '[&>*:first-child]:order-last lg:[&>*:first-child]:order-none',
} as const;

const SPLIT_GAP = {
  '0': 'gap-0',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
  '10': 'gap-10',
  '12': 'gap-12',
  '16': 'gap-16',
} as const;

const SPLIT_ALIGN = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

type SplitRatio = keyof typeof SPLIT_COLUMNS.none;
type SplitCollapse = keyof typeof SPLIT_COLUMNS;
type SplitGap = keyof typeof SPLIT_GAP;
type SplitAlign = keyof typeof SPLIT_ALIGN;

interface SplitProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  ratio?: SplitRatio;
  collapse?: SplitCollapse;
  gap?: SplitGap;
  align?: SplitAlign;
  reverse?: boolean;
}

const Split = ({
  as: Component = 'div',
  ratio = '1/2',
  collapse = 'md',
  gap = '6',
  align = 'stretch',
  reverse = false,
  className,
  children,
  ref,
  ...props
}: SplitProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <Component
      ref={ref}
      data-slot="split"
      data-ratio={ratio}
      data-collapse={collapse}
      className={cn(
        'grid w-full grid-cols-1 [&>*]:min-w-0',
        SPLIT_COLUMNS[collapse][ratio],
        SPLIT_GAP[gap],
        SPLIT_ALIGN[align],
        reverse && SPLIT_REVERSE[collapse],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

Split.displayName = 'Split';

export { Split };
export type { SplitProps, SplitRatio, SplitCollapse, SplitGap, SplitAlign };
