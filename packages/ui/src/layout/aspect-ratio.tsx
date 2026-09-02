import React from 'react';
import { cn } from '../lib/cn';

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  ratio?: number;
}

const AspectRatio = ({
  as: Component = 'div',
  ratio = 16 / 9,
  className,
  style,
  children,
  ref,
  ...props
}: AspectRatioProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <Component
      ref={ref}
      data-slot="aspect-ratio"
      style={{ aspectRatio: String(ratio), ...style }}
      className={cn(
        'relative w-full overflow-hidden [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:size-full [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
export type { AspectRatioProps };
