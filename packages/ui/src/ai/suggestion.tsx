import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const suggestionVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-1.5 rounded-full border text-sm whitespace-nowrap',
    'transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-3.5 [&>svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: 'border-border bg-background hover:bg-muted text-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-muted',
        ghost:
          'border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-3',
        lg: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
);

interface SuggestionProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof suggestionVariants> {
  suggestion: string;
  onClick?: (suggestion: string) => void;
}

type SuggestionGroupProps = React.HTMLAttributes<HTMLDivElement>;

const SuggestionRoot = ({
  className,
  variant,
  size,
  suggestion,
  onClick,
  children,
  ref,
  ...props
}: SuggestionProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onClick?.(suggestion)}
      className={cn(suggestionVariants({ variant, size }), className)}
      {...props}
    >
      {children ?? suggestion}
    </button>
  );
};

SuggestionRoot.displayName = 'Suggestion';

const SuggestionGroup = ({
  className,
  ref,
  ...props
}: SuggestionGroupProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('hide-scrollbar flex w-full items-center gap-2 overflow-x-auto', className)}
      {...props}
    />
  );
};

SuggestionGroup.displayName = 'SuggestionGroup';

const Suggestion = Object.assign(SuggestionRoot, {
  Group: SuggestionGroup,
});

export { Suggestion, suggestionVariants };
export type { SuggestionGroupProps, SuggestionProps };
