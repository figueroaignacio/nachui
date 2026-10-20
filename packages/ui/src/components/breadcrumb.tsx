import * as React from 'react';
import { cn } from '../lib/cn';
import { assignRef } from '../lib/overlay';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronRightIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function MoreHorizontalIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}

type SlotProps = Record<string, unknown> & {
  className?: string;
  style?: React.CSSProperties;
};

function mergeSlotProps(slotProps: SlotProps, childProps: SlotProps): SlotProps {
  const merged: SlotProps = { ...slotProps, ...childProps };
  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (
      /^on[A-Z]/.test(key) &&
      typeof slotValue === 'function' &&
      typeof childValue === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        childValue(...args);
        slotValue(...args);
      };
    }
  }
  if (slotProps.style || childProps.style) {
    merged.style = { ...slotProps.style, ...childProps.style };
  }
  merged.className = cn(slotProps.className, childProps.className);
  return merged;
}

const BreadcrumbRoot = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }) => {
  return <nav ref={ref} aria-label="breadcrumb" className={className} {...props} />;
};

const BreadcrumbList = ({
  className,
  ref,
  ...props
}: React.OlHTMLAttributes<HTMLOListElement> & { ref?: React.Ref<HTMLOListElement> }) => {
  return (
    <ol
      ref={ref}
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5',
        className,
      )}
      {...props}
    />
  );
};

const BreadcrumbItem = ({
  className,
  ref,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & { ref?: React.Ref<HTMLLIElement> }) => {
  return <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
};

type BreadcrumbLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

const BreadcrumbLink = ({
  className,
  children,
  ref,
  ...props
}: BreadcrumbLinkProps & { ref?: React.Ref<HTMLAnchorElement> }) => {
  const isLinkComponent =
    React.isValidElement(children) &&
    (typeof children.type === 'function' || typeof children.type === 'object');

  if (isLinkComponent) {
    const childProps = children.props as SlotProps & { ref?: React.Ref<HTMLAnchorElement> };
    const childRef = childProps.ref;
    return React.cloneElement(children as React.ReactElement<SlotProps>, {
      ...mergeSlotProps(
        { ...props, className: cn('hover:text-foreground', className) },
        childProps,
      ),
      ref:
        ref || childRef
          ? (node: HTMLAnchorElement | null) => {
              assignRef(ref, node);
              assignRef(childRef, node);
            }
          : undefined,
    });
  }

  return (
    <a ref={ref} className={cn('hover:text-foreground', className)} {...props}>
      {children}
    </a>
  );
};

const BreadcrumbPage = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }) => {
  return (
    <span
      ref={ref}
      aria-current="page"
      className={cn('text-foreground font-normal', className)}
      {...props}
    />
  );
};

const BreadcrumbSeparator = ({
  children,
  className,
  ref,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & { ref?: React.Ref<HTMLLIElement> }) => {
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRightIcon size={14} className="size-3.5" />}
    </li>
  );
};

type BreadcrumbEllipsisProps = React.HTMLAttributes<HTMLSpanElement> & {
  label?: string;
};

const BreadcrumbEllipsis = ({
  className,
  label = 'More',
  ref,
  ...props
}: BreadcrumbEllipsisProps & { ref?: React.Ref<HTMLSpanElement> }) => {
  return (
    <span ref={ref} className={cn('flex size-9 items-center justify-center', className)} {...props}>
      <MoreHorizontalIcon className="size-4" size={16} />
      <span className="sr-only">{label}</span>
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
export type { BreadcrumbEllipsisProps, BreadcrumbLinkProps };
