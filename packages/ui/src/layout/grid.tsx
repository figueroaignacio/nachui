import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

const gridVariants = cva('grid', {
  variants: {
    columns: {
      '1': 'grid-cols-1',
      '2': 'grid-cols-2',
      '3': 'grid-cols-3',
      '4': 'grid-cols-4',
      '5': 'grid-cols-5',
      '6': 'grid-cols-6',
      '7': 'grid-cols-7',
      '8': 'grid-cols-8',
      '9': 'grid-cols-9',
      '10': 'grid-cols-10',
      '11': 'grid-cols-11',
      '12': 'grid-cols-12',
      none: 'grid-cols-none',
      subgrid: 'grid-cols-subgrid',
    },
    rows: {
      '1': 'grid-rows-1',
      '2': 'grid-rows-2',
      '3': 'grid-rows-3',
      '4': 'grid-rows-4',
      '5': 'grid-rows-5',
      '6': 'grid-rows-6',
      none: 'grid-rows-none',
      subgrid: 'grid-rows-subgrid',
    },
    flow: {
      row: 'grid-flow-row',
      col: 'grid-flow-col',
      dense: 'grid-flow-dense',
      'row-dense': 'grid-flow-row-dense',
      'col-dense': 'grid-flow-col-dense',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
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
    gapX: {
      '0': 'gap-x-0',
      '1': 'gap-x-1',
      '2': 'gap-x-2',
      '3': 'gap-x-3',
      '4': 'gap-x-4',
      '5': 'gap-x-5',
      '6': 'gap-x-6',
      '8': 'gap-x-8',
      '10': 'gap-x-10',
      '12': 'gap-x-12',
      '16': 'gap-x-16',
      '20': 'gap-x-20',
      '24': 'gap-x-24',
      '32': 'gap-x-32',
    },
    gapY: {
      '0': 'gap-y-0',
      '1': 'gap-y-1',
      '2': 'gap-y-2',
      '3': 'gap-y-3',
      '4': 'gap-y-4',
      '5': 'gap-y-5',
      '6': 'gap-y-6',
      '8': 'gap-y-8',
      '10': 'gap-y-10',
      '12': 'gap-y-12',
      '16': 'gap-y-16',
      '20': 'gap-y-20',
      '24': 'gap-y-24',
      '32': 'gap-y-32',
    },
  },
  defaultVariants: {
    columns: '1',
  },
});

const GRID_RESPONSIVE_COLUMNS = {
  sm: {
    '1': 'sm:grid-cols-1',
    '2': 'sm:grid-cols-2',
    '3': 'sm:grid-cols-3',
    '4': 'sm:grid-cols-4',
    '5': 'sm:grid-cols-5',
    '6': 'sm:grid-cols-6',
    '7': 'sm:grid-cols-7',
    '8': 'sm:grid-cols-8',
    '9': 'sm:grid-cols-9',
    '10': 'sm:grid-cols-10',
    '11': 'sm:grid-cols-11',
    '12': 'sm:grid-cols-12',
    none: 'sm:grid-cols-none',
    subgrid: 'sm:grid-cols-subgrid',
  },
  md: {
    '1': 'md:grid-cols-1',
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-4',
    '5': 'md:grid-cols-5',
    '6': 'md:grid-cols-6',
    '7': 'md:grid-cols-7',
    '8': 'md:grid-cols-8',
    '9': 'md:grid-cols-9',
    '10': 'md:grid-cols-10',
    '11': 'md:grid-cols-11',
    '12': 'md:grid-cols-12',
    none: 'md:grid-cols-none',
    subgrid: 'md:grid-cols-subgrid',
  },
  lg: {
    '1': 'lg:grid-cols-1',
    '2': 'lg:grid-cols-2',
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
    '5': 'lg:grid-cols-5',
    '6': 'lg:grid-cols-6',
    '7': 'lg:grid-cols-7',
    '8': 'lg:grid-cols-8',
    '9': 'lg:grid-cols-9',
    '10': 'lg:grid-cols-10',
    '11': 'lg:grid-cols-11',
    '12': 'lg:grid-cols-12',
    none: 'lg:grid-cols-none',
    subgrid: 'lg:grid-cols-subgrid',
  },
  xl: {
    '1': 'xl:grid-cols-1',
    '2': 'xl:grid-cols-2',
    '3': 'xl:grid-cols-3',
    '4': 'xl:grid-cols-4',
    '5': 'xl:grid-cols-5',
    '6': 'xl:grid-cols-6',
    '7': 'xl:grid-cols-7',
    '8': 'xl:grid-cols-8',
    '9': 'xl:grid-cols-9',
    '10': 'xl:grid-cols-10',
    '11': 'xl:grid-cols-11',
    '12': 'xl:grid-cols-12',
    none: 'xl:grid-cols-none',
    subgrid: 'xl:grid-cols-subgrid',
  },
} as const;

type GridColumns = keyof typeof GRID_RESPONSIVE_COLUMNS.sm;
type GridBreakpoint = keyof typeof GRID_RESPONSIVE_COLUMNS;
type GridResponsiveColumns = { base?: GridColumns } & Partial<Record<GridBreakpoint, GridColumns>>;

type GridOwnProps<E extends React.ElementType> = Omit<
  VariantProps<typeof gridVariants>,
  'columns'
> & {
  as?: E;
  columns?: GridColumns | GridResponsiveColumns | null;
  minChildWidth?: string;
  className?: string;
  style?: React.CSSProperties;
};

type GridProps<E extends React.ElementType = 'div'> = GridOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof GridOwnProps<E>>;

const BREAKPOINTS: GridBreakpoint[] = ['sm', 'md', 'lg', 'xl'];

const Grid = <E extends React.ElementType = 'div'>({
  as,
  columns,
  minChildWidth,
  rows,
  flow,
  align,
  justify,
  gap,
  gapX,
  gapY,
  className,
  style,
  ...props
}: GridProps<E>) => {
  const Component: React.ElementType = as ?? 'div';
  const responsive = typeof columns === 'object' && columns !== null ? columns : null;
  const base = typeof columns === 'object' && columns !== null ? columns.base : columns;

  return (
    <Component
      style={
        minChildWidth
          ? {
              gridTemplateColumns: `repeat(auto-fit, minmax(min(${minChildWidth}, 100%), 1fr))`,
              ...style,
            }
          : style
      }
      className={cn(
        gridVariants({ columns: base, rows, flow, align, justify, gap, gapX, gapY }),
        responsive &&
          BREAKPOINTS.map((breakpoint) => {
            const value = responsive[breakpoint];
            return value ? GRID_RESPONSIVE_COLUMNS[breakpoint][value] : null;
          }),
        className,
      )}
      {...props}
    />
  );
};

Grid.displayName = 'Grid';

export { Grid, gridVariants };
export type { GridBreakpoint, GridColumns, GridProps, GridResponsiveColumns };
