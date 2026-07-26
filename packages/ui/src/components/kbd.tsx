import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const kbdVariants = cva(
  'inline-flex items-center justify-center border border-b-2 font-mono font-medium text-muted-foreground transition-all gap-1',
  {
    variants: {
      size: {
        sm: 'h-5 px-1.5 text-[10px] min-w-[20px] rounded-sm',
        default: 'h-6 px-2 text-[11px] min-w-[24px] rounded-sm',
        lg: 'h-8 px-2.5 text-[13px] min-w-[32px] rounded-sm',
      },
      variant: {
        default: 'bg-muted/50 text-muted-foreground border-border/80 border-b-border',
        outline: 'bg-transparent text-foreground border-border border-b-border',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof kbdVariants> {
  abbrTitle?: string;
  ref?: React.Ref<HTMLElement>;
}

const Kbd = ({ className, size, variant, abbrTitle, ref, ...props }: KbdProps) => {
  return (
    <kbd
      ref={ref}
      title={abbrTitle}
      className={cn(kbdVariants({ size, variant }), className)}
      {...props}
    />
  );
};
Kbd.displayName = 'Kbd';

const kbdGroupVariants = cva('inline-flex items-center gap-1');

export type KbdGroupProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

const KbdGroup = ({ className, ref, ...props }: KbdGroupProps) => {
  return <span ref={ref} className={cn(kbdGroupVariants(), className)} {...props} />;
};
KbdGroup.displayName = 'KbdGroup';

export { Kbd, KbdGroup, kbdVariants };
