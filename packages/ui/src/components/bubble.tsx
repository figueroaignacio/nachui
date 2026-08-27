import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const bubbleVariants = cva(
  'relative flex w-fit max-w-full flex-col rounded-xl text-sm transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-foreground',
        tinted: 'bg-primary/10 text-foreground',
        outline: 'border-border text-foreground border bg-transparent',
        ghost: 'text-foreground bg-transparent',
        destructive:
          'bg-destructive-surface text-destructive-text border-destructive-border border',
      },
      align: {
        start: 'self-start',
        end: 'self-end',
      },
    },
    defaultVariants: {
      variant: 'default',
      align: 'start',
    },
  },
);

const bubbleReactionsVariants = cva(
  'border-border bg-background absolute z-10 flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs leading-none shadow-sm select-none',
  {
    variants: {
      side: {
        top: '-top-3',
        bottom: '-bottom-3',
      },
      align: {
        start: 'left-2',
        end: 'right-2',
      },
    },
    defaultVariants: {
      side: 'bottom',
      align: 'end',
    },
  },
);

const bubbleGroupVariants = cva('flex w-full flex-col gap-1', {
  variants: {
    align: {
      start: 'items-start',
      end: 'items-end',
    },
  },
  defaultVariants: {
    align: 'start',
  },
});

interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bubbleVariants> {}

interface BubbleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

interface BubbleReactionsProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bubbleReactionsVariants> {}

interface BubbleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bubbleGroupVariants> {}

const BubbleRoot = ({
  className,
  variant,
  align,
  ref,
  ...props
}: BubbleProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn(bubbleVariants({ variant, align }), className)} {...props} />;
};

BubbleRoot.displayName = 'Bubble';

const BubbleContent = ({
  className,
  asChild = false,
  children,
  ref,
  ...props
}: BubbleContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const contentClassName = cn(
    'px-3.5 py-2 leading-relaxed break-words whitespace-pre-wrap',
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as { className?: string };
    return React.cloneElement(children, {
      className: cn(contentClassName, childProps.className),
      ...props,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <div ref={ref} className={contentClassName} {...props}>
      {children}
    </div>
  );
};

BubbleContent.displayName = 'BubbleContent';

const BubbleReactions = ({
  className,
  side,
  align,
  ref,
  ...props
}: BubbleReactionsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div ref={ref} className={cn(bubbleReactionsVariants({ side, align }), className)} {...props} />
  );
};

BubbleReactions.displayName = 'BubbleReactions';

const BubbleGroup = ({
  className,
  align,
  ref,
  ...props
}: BubbleGroupProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn(bubbleGroupVariants({ align }), className)} {...props} />;
};

BubbleGroup.displayName = 'BubbleGroup';

const Bubble = Object.assign(BubbleRoot, {
  Content: BubbleContent,
  Reactions: BubbleReactions,
  Group: BubbleGroup,
});

export { Bubble, bubbleGroupVariants, bubbleReactionsVariants, bubbleVariants };
export type { BubbleContentProps, BubbleGroupProps, BubbleProps, BubbleReactionsProps };
