import { ArrowLeft01Icon, ArrowRight01Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

interface PaginationProps extends React.ComponentProps<'nav'> {
  label?: string;
}

type PaginationContentProps = React.ComponentProps<'ul'>;
type PaginationItemProps = React.ComponentProps<'li'>;

interface PaginationLinkProps extends React.ComponentProps<'a'> {
  isActive?: boolean;
  disabled?: boolean;
  size?: 'default' | 'icon';
}

interface PaginationPreviousProps extends Omit<PaginationLinkProps, 'size'> {
  iconOnly?: boolean;
}

interface PaginationNextProps extends Omit<PaginationLinkProps, 'size'> {
  iconOnly?: boolean;
}

interface PaginationEllipsisProps extends React.ComponentProps<'span'> {
  label?: string;
}

const PaginationRoot = ({
  className,
  label = 'Pagination',
  ref,
  ...props
}: PaginationProps & { ref?: React.Ref<HTMLElement> }) => {
  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
};

PaginationRoot.displayName = 'Pagination';

const PaginationContent = ({
  className,
  ref,
  ...props
}: PaginationContentProps & { ref?: React.Ref<HTMLUListElement> }) => {
  return <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />;
};

PaginationContent.displayName = 'PaginationContent';

const PaginationItem = ({
  className,
  ref,
  ...props
}: PaginationItemProps & { ref?: React.Ref<HTMLLIElement> }) => {
  return <li ref={ref} className={cn(className)} {...props} />;
};

PaginationItem.displayName = 'PaginationItem';

const linkClassName = (isActive: boolean, disabled: boolean, size: 'default' | 'icon') =>
  cn(
    'inline-flex h-9 cursor-pointer items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors select-none',
    'hover:bg-muted focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
    size === 'icon' ? 'w-9' : 'px-3',
    isActive && 'border-border border',
    disabled && 'pointer-events-none opacity-50',
  );

const PaginationLink = ({
  className,
  isActive = false,
  disabled = false,
  size = 'icon',
  href,
  children,
  ref,
  ...props
}: PaginationLinkProps & { ref?: React.Ref<HTMLAnchorElement> }) => {
  const sharedClassName = cn(linkClassName(isActive, disabled, size), className);

  if (href === undefined) {
    return (
      <button
        type="button"
        aria-current={isActive ? 'page' : undefined}
        disabled={disabled}
        className={sharedClassName}
        {...(props as React.ComponentProps<'button'>)}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={sharedClassName}
      {...props}
    >
      {children}
    </a>
  );
};

PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  iconOnly = false,
  children = 'Previous',
  ...props
}: PaginationPreviousProps) => {
  return (
    <PaginationLink
      size={iconOnly ? 'icon' : 'default'}
      className={cn('pl-2.5', iconOnly && 'pl-0', className)}
      {...props}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden="true" />
      {iconOnly ? <span className="sr-only">{children}</span> : <span>{children}</span>}
    </PaginationLink>
  );
};

PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  iconOnly = false,
  children = 'Next',
  ...props
}: PaginationNextProps) => {
  return (
    <PaginationLink
      size={iconOnly ? 'icon' : 'default'}
      className={cn('pr-2.5', iconOnly && 'pr-0', className)}
      {...props}
    >
      {iconOnly ? <span className="sr-only">{children}</span> : <span>{children}</span>}
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" />
    </PaginationLink>
  );
};

PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  label = 'More pages',
  ref,
  ...props
}: PaginationEllipsisProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
      <span className="sr-only">{label}</span>
    </span>
  );
};

PaginationEllipsis.displayName = 'PaginationEllipsis';

const Pagination = Object.assign(PaginationRoot, {
  Content: PaginationContent,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
});

export { Pagination };
export type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
};
