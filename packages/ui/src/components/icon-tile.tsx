import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const iconTileVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-medium leading-none select-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        outline: 'bg-background border-border text-(--tile-color) border',
        elevated: 'bg-muted text-(--tile-color) ring-background shadow-sm ring-2',
        soft: 'bg-(--tile-color)/10 border-(--tile-color)/20 text-(--tile-color) ring-(--tile-color)/5 border ring-4',
        solid: 'bg-(--tile-color) text-(--tile-contrast)',
        frame: 'bg-card border-border text-(--tile-color) ring-muted border ring-4',
      },
      size: {
        xs: 'size-6 text-[10px] [&_svg]:size-3.5',
        sm: 'size-8 text-xs [&_svg]:size-4',
        default: 'size-10 text-sm [&_svg]:size-[18px]',
        lg: 'size-12 text-base [&_svg]:size-[22px]',
        xl: 'size-14 text-lg [&_svg]:size-7',
      },
      radius: {
        default: 'rounded-lg',
        full: 'rounded-full',
      },
      tone: {
        default: '[--tile-color:var(--color-foreground)] [--tile-contrast:var(--color-background)]',
        muted:
          '[--tile-color:var(--color-muted-foreground)] [--tile-contrast:var(--color-background)]',
        primary:
          '[--tile-color:var(--color-primary)] [--tile-contrast:var(--color-primary-foreground)]',
        success:
          '[--tile-color:var(--color-success)] [--tile-contrast:var(--color-success-foreground)]',
        warning:
          '[--tile-color:var(--color-warning)] [--tile-contrast:var(--color-warning-foreground)]',
        info: '[--tile-color:var(--color-info)] [--tile-contrast:var(--color-info-foreground)]',
        destructive:
          '[--tile-color:var(--color-destructive)] [--tile-contrast:var(--color-destructive-foreground)]',
      },
    },
    compoundVariants: [{ size: 'xs', radius: 'default', className: 'rounded-md' }],
    defaultVariants: {
      variant: 'outline',
      size: 'default',
      radius: 'default',
      tone: 'default',
    },
  },
);

interface IconTileProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof iconTileVariants> {}

const IconTile = ({
  className,
  variant,
  size,
  radius,
  tone,
  ref,
  ...props
}: IconTileProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  return (
    <span
      ref={ref}
      data-slot="icon-tile"
      className={cn(iconTileVariants({ variant, size, radius, tone }), className)}
      {...props}
    />
  );
};

IconTile.displayName = 'IconTile';

export { IconTile, iconTileVariants };
export type { IconTileProps };
