import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';

const cardVariants = cva(
  'rounded-md transition-colors duration-150 h-full flex flex-col justify-between',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border border-border',
        outline: 'text-card-foreground border border-border',
        ghost: 'bg-transparent text-card-foreground border-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const cardHeaderVariants = cva('flex flex-col space-y-1.5', {
  variants: {
    compact: {
      true: 'px-4 pt-4',
      false: 'px-6 pt-6',
    },
  },
  defaultVariants: {
    compact: false,
  },
});

const cardTitleVariants = cva('text-base font-medium leading-none tracking-tight');
const cardDescriptionVariants = cva('text-sm text-muted-foreground leading-relaxed');

const cardContentVariants = cva('flex-1', {
  variants: {
    compact: {
      true: 'p-4 pt-0',
      false: 'p-6 pt-0',
    },
  },
  defaultVariants: {
    compact: false,
  },
});

const cardFooterVariants = cva('flex items-center', {
  variants: {
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    compact: {
      true: 'p-4 pt-0',
      false: 'p-6 pt-0',
    },
  },
  defaultVariants: {
    align: 'start',
    compact: false,
  },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardHeaderVariants> {}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardContentVariants> {}

interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardFooterVariants> {}

const CardRoot = ({
  className,
  variant = 'default',
  as: Component = 'div',
  children,
  ref,
  ...props
}: CardProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <Component ref={ref} className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  );
};

CardRoot.displayName = 'Card';

const CardHeader = ({
  className,
  compact,
  children,
  ref,
  ...props
}: CardHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div ref={ref} className={cn(cardHeaderVariants({ compact }), className)} {...props}>
      {children}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

const CardTitle = ({
  className,
  as: Component = 'h3',
  children,
  ref,
  ...props
}: CardTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => {
  return (
    <Component ref={ref} className={cn(cardTitleVariants(), className)} {...props}>
      {children}
    </Component>
  );
};

CardTitle.displayName = 'CardTitle';

const CardDescription = ({
  className,
  children,
  ref,
  ...props
}: CardDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  return (
    <p ref={ref} className={cn(cardDescriptionVariants(), className)} {...props}>
      {children}
    </p>
  );
};

CardDescription.displayName = 'CardDescription';

const CardContent = ({
  className,
  compact,
  children,
  ref,
  ...props
}: CardContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div ref={ref} className={cn(cardContentVariants({ compact }), className)} {...props}>
      {children}
    </div>
  );
};

CardContent.displayName = 'CardContent';

const CardFooter = ({
  className,
  align,
  compact,
  children,
  ref,
  ...props
}: CardFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div ref={ref} className={cn(cardFooterVariants({ align, compact }), className)} {...props}>
      {children}
    </div>
  );
};

CardFooter.displayName = 'CardFooter';

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export {
  Card,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
};

export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
};
