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

interface CenterProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof centerVariants> {
  as?: React.ElementType;
}

const Center = ({
  as: Component = 'div',
  axis,
  inline,
  text,
  className,
  children,
  ref,
  ...props
}: CenterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <Component
      ref={ref}
      data-slot="center"
      className={cn(centerVariants({ axis, inline, text }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

Center.displayName = 'Center';

export { Center, centerVariants };
export type { CenterProps };
