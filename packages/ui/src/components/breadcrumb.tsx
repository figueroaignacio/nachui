import { ArrowRight01Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

const BreadcrumbRoot = ({ className, ...props }: React.ComponentProps<'nav'>) => {
  return <nav aria-label="breadcrumb" className={className} {...props} />;
};

const BreadcrumbList = ({ className, ...props }: React.ComponentProps<'ol'>) => {
  return (
    <ol
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5',
        className,
      )}
      {...props}
    />
  );
};

const BreadcrumbItem = ({ className, ...props }: React.ComponentProps<'li'>) => {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
};

type BreadcrumbLinkProps = React.ComponentProps<'a'> & {
  children: React.ReactNode;
};

const BreadcrumbLink = ({ className, children, ...props }: BreadcrumbLinkProps) => {
  const isLinkComponent =
    React.isValidElement(children) &&
    (typeof children.type === 'function' || typeof children.type === 'object');

  if (isLinkComponent) {
    return <span className={cn('hover:text-foreground', className)}>{children}</span>;
  }

  return (
    <a className={cn('hover:text-foreground', className)} {...props}>
      {children}
    </a>
  );
};

const BreadcrumbPage = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span aria-current="page" className={cn('text-foreground font-normal', className)} {...props} />
  );
};

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="size-3.5" />}
    </li>
  );
};

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" size={16} />
    </span>
  );
};

const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});

export { Breadcrumb };
