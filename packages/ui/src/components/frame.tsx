import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const frameVariants = cva('flex w-full flex-col rounded-xl', {
  variants: {
    variant: {
      default: 'bg-muted/40 border-border border',
      ghost: 'bg-transparent border-transparent border',
    },
    spacing: {
      sm: 'p-1 gap-1',
      default: 'p-1.5 gap-1.5',
      lg: 'p-2.5 gap-2.5',
    },
    stacked: {
      true: [
        'gap-0',
        '[&>[data-slot=frame-panel]]:rounded-none',
        '[&>[data-slot=frame-panel]+[data-slot=frame-panel]]:border-t-0',
        '[&>[data-slot=frame-panel]:not([data-slot=frame-panel]+[data-slot=frame-panel])]:rounded-t-lg',
        '[&>[data-slot=frame-panel]:not(:has(+[data-slot=frame-panel]))]:rounded-b-lg',
      ].join(' '),
      false: '',
    },
    dense: {
      true: '[&>[data-slot=frame-panel]]:p-0',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'default',
    stacked: false,
    dense: false,
  },
});

interface FrameProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof frameVariants> {}

type FrameHeaderProps = React.HTMLAttributes<HTMLDivElement>;

interface FrameTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

type FrameDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
type FramePanelProps = React.HTMLAttributes<HTMLDivElement>;
type FrameFooterProps = React.HTMLAttributes<HTMLDivElement>;

const FrameRoot = ({
  className,
  variant,
  spacing,
  stacked,
  dense,
  ref,
  ...props
}: FrameProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(frameVariants({ variant, spacing, stacked, dense }), className)}
      {...props}
    />
  );
};

FrameRoot.displayName = 'Frame';

const FrameHeader = ({
  className,
  ref,
  ...props
}: FrameHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex flex-col gap-1 px-3 py-2.5', className)} {...props} />;
};

FrameHeader.displayName = 'FrameHeader';

const FrameTitle = ({
  className,
  as: Component = 'h3',
  ref,
  ...props
}: FrameTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => {
  return (
    <Component
      ref={ref}
      className={cn('text-sm leading-none font-medium tracking-tight', className)}
      {...props}
    />
  );
};

FrameTitle.displayName = 'FrameTitle';

const FrameDescription = ({
  className,
  ref,
  ...props
}: FrameDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  return (
    <p
      ref={ref}
      className={cn('text-muted-foreground text-xs leading-relaxed', className)}
      {...props}
    />
  );
};

FrameDescription.displayName = 'FrameDescription';

const FramePanel = ({
  className,
  ref,
  ...props
}: FramePanelProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-slot="frame-panel"
      className={cn(
        'bg-card text-card-foreground border-border overflow-hidden rounded-lg border p-4',
        className,
      )}
      {...props}
    />
  );
};

FramePanel.displayName = 'FramePanel';

const FrameFooter = ({
  className,
  ref,
  ...props
}: FrameFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div ref={ref} className={cn('flex items-center gap-2 px-3 py-2.5', className)} {...props} />
  );
};

FrameFooter.displayName = 'FrameFooter';

const Frame = Object.assign(FrameRoot, {
  Header: FrameHeader,
  Title: FrameTitle,
  Description: FrameDescription,
  Panel: FramePanel,
  Footer: FrameFooter,
});

export { Frame, frameVariants };
export type {
  FrameDescriptionProps,
  FrameFooterProps,
  FrameHeaderProps,
  FramePanelProps,
  FrameProps,
  FrameTitleProps,
};
