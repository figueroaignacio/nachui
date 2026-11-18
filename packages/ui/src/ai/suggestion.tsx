import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';
import { ARRIVE, Arrivals, useArrival } from '../lib/arrival';

const suggestionVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-1.5 rounded-full text-sm whitespace-nowrap',
    'transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-3.5 [&>svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: 'bg-card hover:bg-muted text-foreground shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
        ghost: 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted shadow-sm',
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

interface SuggestionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  wrap?: boolean;
}

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
  const arrived = useArrival();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onClick?.(suggestion)}
      className={cn(suggestionVariants({ variant, size }), arrived && ARRIVE, className)}
      {...props}
    >
      {children ?? suggestion}
    </button>
  );
};

SuggestionRoot.displayName = 'Suggestion';

const SuggestionGroup = ({
  className,
  wrap = false,
  ref,
  ...props
}: SuggestionGroupProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <Arrivals>
      <div
        ref={ref}
        data-wrap={wrap ? '' : undefined}
        className={cn(
          'flex w-full items-center gap-2',
          wrap
            ? 'flex-wrap'
            : 'hide-scrollbar overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]',
          className,
        )}
        {...props}
      />
    </Arrivals>
  );
};

SuggestionGroup.displayName = 'SuggestionGroup';

const Suggestion = Object.assign(SuggestionRoot, {
  Group: SuggestionGroup,
});

export { Suggestion, suggestionVariants };
export type { SuggestionGroupProps, SuggestionProps };
