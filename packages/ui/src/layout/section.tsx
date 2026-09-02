import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/cn';
import { Container, type ContainerProps } from './container';

const sectionVariants = cva('relative w-full', {
  variants: {
    size: {
      sm: 'py-8 sm:py-10',
      md: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-24',
      xl: 'py-24 sm:py-32',
    },
    background: {
      default: 'bg-background text-foreground',
      muted: 'bg-muted text-foreground',
      card: 'bg-card text-card-foreground',
      primary: 'bg-primary text-primary-foreground',
      inverted: 'bg-foreground text-background',
    },
    bordered: {
      true: 'border-border border-y',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    background: 'default',
    bordered: false,
  },
});

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
  contained?: boolean | NonNullable<ContainerProps['size']>;
}

const SectionRoot = ({
  as: Component = 'section',
  size,
  background,
  bordered,
  contained = true,
  className,
  children,
  ref,
  ...props
}: SectionProps & { ref?: React.Ref<HTMLElement> }) => {
  const content = contained ? (
    <Container size={contained === true ? undefined : contained}>{children}</Container>
  ) : (
    children
  );

  return (
    <Component
      ref={ref}
      data-slot="section"
      data-background={background ?? 'default'}
      className={cn(sectionVariants({ size, background, bordered }), className)}
      {...props}
    >
      {content}
    </Component>
  );
};
SectionRoot.displayName = 'Section';

const sectionHeaderVariants = cva('flex flex-col gap-3', {
  variants: {
    align: {
      start: 'items-start text-left',
      center: 'items-center text-center',
    },
    spacing: {
      sm: 'mb-6',
      md: 'mb-10',
      lg: 'mb-14',
    },
  },
  defaultVariants: {
    align: 'start',
    spacing: 'md',
  },
});

interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sectionHeaderVariants> {}

const SectionHeader = ({
  align,
  spacing,
  className,
  ref,
  ...props
}: SectionHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    data-slot="section-header"
    className={cn(sectionHeaderVariants({ align, spacing }), className)}
    {...props}
  />
);
SectionHeader.displayName = 'SectionHeader';

const SectionEyebrow = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) => (
  <p
    ref={ref}
    data-slot="section-eyebrow"
    className={cn('text-primary text-xs font-medium tracking-widest uppercase', className)}
    {...props}
  />
);
SectionEyebrow.displayName = 'SectionEyebrow';

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

const SectionTitle = ({
  as: Component = 'h2',
  className,
  ref,
  ...props
}: SectionTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => (
  <Component
    ref={ref}
    data-slot="section-title"
    className={cn(
      'text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl',
      className,
    )}
    {...props}
  />
);
SectionTitle.displayName = 'SectionTitle';

const SectionDescription = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) => (
  <p
    ref={ref}
    data-slot="section-description"
    className={cn('max-w-2xl text-base text-pretty opacity-70 sm:text-lg', className)}
    {...props}
  />
);
SectionDescription.displayName = 'SectionDescription';

const SectionActions = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    data-slot="section-actions"
    className={cn('flex flex-wrap items-center gap-3 pt-2', className)}
    {...props}
  />
);
SectionActions.displayName = 'SectionActions';

const Section = Object.assign(SectionRoot, {
  Header: SectionHeader,
  Eyebrow: SectionEyebrow,
  Title: SectionTitle,
  Description: SectionDescription,
  Actions: SectionActions,
});

export { Section, sectionVariants };
export type { SectionProps, SectionHeaderProps, SectionTitleProps };
