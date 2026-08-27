import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const emptyVariants = cva(
  'flex w-full flex-col items-center justify-center gap-4 rounded-xl px-6 py-10 text-center',
  {
    variants: {
      variant: {
        default: '',
        outline: 'border-border border border-dashed',
        card: 'bg-card border-border border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const emptyMediaVariants = cva('mb-1 flex items-center justify-center', {
  variants: {
    variant: {
      default: '',
      icon: 'bg-muted text-muted-foreground size-12 rounded-lg [&_svg]:size-6',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyVariants> {}

type EmptyHeaderProps = React.HTMLAttributes<HTMLDivElement>;

interface EmptyMediaProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyMediaVariants> {}

interface EmptyTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

type EmptyDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
type EmptyContentProps = React.HTMLAttributes<HTMLDivElement>;

const EmptyRoot = ({
  className,
  variant,
  ref,
  ...props
}: EmptyProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn(emptyVariants({ variant }), className)} {...props} />;
};

EmptyRoot.displayName = 'Empty';

const EmptyHeader = ({
  className,
  ref,
  ...props
}: EmptyHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('flex max-w-sm flex-col items-center gap-2', className)}
      {...props}
    />
  );
};

EmptyHeader.displayName = 'EmptyHeader';

const EmptyMedia = ({
  className,
  variant,
  ref,
  ...props
}: EmptyMediaProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  );
};

EmptyMedia.displayName = 'EmptyMedia';

const EmptyTitle = ({
  className,
  as: Component = 'h3',
  ref,
  ...props
}: EmptyTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => {
  return (
    <Component
      ref={ref}
      className={cn('text-base font-medium tracking-tight', className)}
      {...props}
    />
  );
};

EmptyTitle.displayName = 'EmptyTitle';

const EmptyDescription = ({
  className,
  ref,
  ...props
}: EmptyDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  return (
    <p
      ref={ref}
      className={cn(
        'text-muted-foreground text-sm leading-relaxed',
        '[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4',
        className,
      )}
      {...props}
    />
  );
};

EmptyDescription.displayName = 'EmptyDescription';

const EmptyContent = ({
  className,
  ref,
  ...props
}: EmptyContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
      {...props}
    />
  );
};

EmptyContent.displayName = 'EmptyContent';

const Empty = Object.assign(EmptyRoot, {
  Header: EmptyHeader,
  Media: EmptyMedia,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Content: EmptyContent,
});

export { Empty, emptyMediaVariants, emptyVariants };
export type {
  EmptyContentProps,
  EmptyDescriptionProps,
  EmptyHeaderProps,
  EmptyMediaProps,
  EmptyProps,
  EmptyTitleProps,
};
