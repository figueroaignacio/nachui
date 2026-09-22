'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronDownIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function BookIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

const SOURCES_CONTENT_VARIANTS = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number],
      },
      opacity: { duration: 0.2, delay: 0.04 },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] },
      opacity: { duration: 0.12 },
    },
  },
} as const;

const CHEVRON_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 } as const;

function sourceHost(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

function countItems(children: React.ReactNode): number {
  let count = 0;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === SourcesItem) {
      count += 1;
      return;
    }
    const nested = (child.props as { children?: React.ReactNode }).children;
    if (nested) count += countItems(nested);
  });
  return count;
}

interface SourcesContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  count: number;
}

const SourcesContext = React.createContext<SourcesContextValue | null>(null);

const useSourcesContext = (): SourcesContextValue => {
  const context = React.use(SourcesContext);
  if (!context) {
    throw new Error('Sources components must be used within Sources');
  }
  return context;
};

interface SourcesProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  count?: number;
}

interface SourcesTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: (count: number) => string;
}

type SourcesContentProps = React.HTMLAttributes<HTMLDivElement>;

interface SourcesItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  href: string;
  title: string;
  favicon?: string | null;
}

const defaultLabel = (count: number) => `Used ${count} ${count === 1 ? 'source' : 'sources'}`;

const SourcesRoot = ({
  className,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  count: explicitCount,
  children,
  ref,
  ...props
}: SourcesProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const id = React.useId();
  const count = explicitCount ?? countItems(children);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = React.useMemo<SourcesContextValue>(
    () => ({ open, setOpen, id, count }),
    [open, setOpen, id, count],
  );

  return (
    <SourcesContext value={value}>
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </div>
    </SourcesContext>
  );
};

SourcesRoot.displayName = 'Sources';

const SourcesTrigger = ({
  className,
  label = defaultLabel,
  children,
  onClick,
  ref,
  ...props
}: SourcesTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { open, setOpen, id, count } = useSourcesContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      ref={ref}
      type="button"
      id={`${id}-trigger`}
      aria-expanded={open}
      aria-controls={`${id}-content`}
      onClick={(event) => {
        setOpen(!open);
        onClick?.(event);
      }}
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-md text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="flex shrink-0">
        <BookIcon size={14} />
      </span>
      <span className="min-w-0 truncate">{children ?? label(count)}</span>
      <motion.span
        aria-hidden="true"
        className="flex shrink-0"
        animate={shouldReduceMotion ? undefined : { rotate: open ? 180 : 0 }}
        transition={CHEVRON_TRANSITION}
      >
        <ChevronDownIcon size={14} />
      </motion.span>
    </button>
  );
};

SourcesTrigger.displayName = 'SourcesTrigger';

const SourcesContent = ({
  className,
  children,
  ref,
  ...props
}: SourcesContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { open, id } = useSourcesContext();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          variants={SOURCES_CONTENT_VARIANTS}
          initial="closed"
          animate="open"
          exit="closed"
          className="overflow-hidden"
        >
          <div className={cn('mt-2 flex flex-col gap-1', className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SourcesContent.displayName = 'SourcesContent';

const SourcesItem = ({
  className,
  href,
  title,
  favicon,
  children,
  ref,
  ...props
}: SourcesItemProps & { ref?: React.Ref<HTMLAnchorElement> }) => {
  const host = sourceHost(href);
  const faviconSrc =
    favicon === undefined
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`
      : favicon;

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group/source text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {faviconSrc ? (
        <img
          src={faviconSrc}
          alt=""
          width={16}
          height={16}
          loading="lazy"
          className="size-4 shrink-0 rounded-sm"
        />
      ) : (
        <span aria-hidden="true" className="bg-border size-4 shrink-0 rounded-sm" />
      )}
      <span className="text-foreground/90 group-hover/source:text-foreground min-w-0 flex-1 truncate">
        {children ?? title}
      </span>
      <span className="shrink-0 font-mono text-[11px]">{host}</span>
    </a>
  );
};

SourcesItem.displayName = 'SourcesItem';

const Sources = Object.assign(SourcesRoot, {
  Trigger: SourcesTrigger,
  Content: SourcesContent,
  Item: SourcesItem,
});

export { Sources, sourceHost };
export type { SourcesContentProps, SourcesItemProps, SourcesProps, SourcesTriggerProps };
