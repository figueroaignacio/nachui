import React from 'react';
import { cn } from '../lib/cn';

type AspectRatioOwnProps<E extends React.ElementType> = {
  as?: E;
  ratio?: number;
  className?: string;
  style?: React.CSSProperties;
};

type AspectRatioProps<E extends React.ElementType = 'div'> = AspectRatioOwnProps<E> &
  Omit<React.ComponentPropsWithRef<E>, keyof AspectRatioOwnProps<E>>;

const AspectRatio = <E extends React.ElementType = 'div'>({
  as,
  ratio = 16 / 9,
  className,
  style,
  ...props
}: AspectRatioProps<E>) => {
  const Component: React.ElementType = as ?? 'div';
  return (
    <Component
      data-slot="aspect-ratio"
      style={{ aspectRatio: String(ratio), ...style }}
      className={cn(
        'relative w-full overflow-hidden [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:size-full [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover',
        className,
      )}
      {...props}
    />
  );
};

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
export type { AspectRatioProps };
