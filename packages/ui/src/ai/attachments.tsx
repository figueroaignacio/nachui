'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function FileIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function XIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

interface AttachmentData {
  id: string;
  filename?: string;
  mediaType?: string;
  url?: string;
  size?: number;
}

const UNITS = ['B', 'KB', 'MB', 'GB'] as const;

function formatSize(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${UNITS[unit]}`;
}

function isImage(data: AttachmentData): boolean {
  return Boolean(data.mediaType?.startsWith('image/'));
}

function attachmentLabel(data: AttachmentData): string {
  return data.filename ?? data.url?.split('/').pop() ?? 'Attachment';
}

const attachmentsVariants = cva('flex w-full min-w-0', {
  variants: {
    variant: {
      grid: 'flex-wrap gap-2',
      inline: 'hide-scrollbar items-center gap-2 overflow-x-auto',
      list: 'flex-col gap-1.5',
    },
  },
  defaultVariants: {
    variant: 'grid',
  },
});

const attachmentItemVariants = cva(
  'group/attachment border-border bg-background relative flex min-w-0 items-center border',
  {
    variants: {
      variant: {
        grid: 'w-40 gap-2 rounded-md p-2',
        inline: 'h-9 shrink-0 gap-2 rounded-full py-1 pr-2 pl-1',
        list: 'w-full gap-3 rounded-md p-2',
      },
    },
    defaultVariants: {
      variant: 'grid',
    },
  },
);

interface AttachmentsContextValue {
  variant: 'grid' | 'inline' | 'list';
}

interface AttachmentItemContextValue {
  data: AttachmentData;
  onRemove?: () => void;
  variant: 'grid' | 'inline' | 'list';
}

const AttachmentsContext = React.createContext<AttachmentsContextValue>({ variant: 'grid' });
const AttachmentItemContext = React.createContext<AttachmentItemContextValue | null>(null);

const useAttachment = (): AttachmentItemContextValue => {
  const context = React.use(AttachmentItemContext);
  if (!context) {
    throw new Error('Attachments.Preview, .Info and .Remove must be used within Attachments.Item');
  }
  return context;
};

interface AttachmentsProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof attachmentsVariants> {}

interface AttachmentItemProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AttachmentData;
  onRemove?: () => void;
}

interface AttachmentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  fallbackIcon?: React.ReactNode;
}

interface AttachmentInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  showMediaType?: boolean;
}

interface AttachmentRemoveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

type AttachmentEmptyProps = React.HTMLAttributes<HTMLDivElement>;

const AttachmentsRoot = ({
  className,
  variant,
  children,
  ref,
  ...props
}: AttachmentsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const resolved = variant ?? 'grid';
  const value = React.useMemo<AttachmentsContextValue>(() => ({ variant: resolved }), [resolved]);

  return (
    <AttachmentsContext value={value}>
      <div
        ref={ref}
        data-variant={resolved}
        className={cn(attachmentsVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </AttachmentsContext>
  );
};

AttachmentsRoot.displayName = 'Attachments';

const AttachmentItem = ({
  className,
  data,
  onRemove,
  children,
  ref,
  ...props
}: AttachmentItemProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { variant } = React.use(AttachmentsContext);
  const value = React.useMemo<AttachmentItemContextValue>(
    () => ({ data, onRemove, variant }),
    [data, onRemove, variant],
  );

  return (
    <AttachmentItemContext value={value}>
      <div ref={ref} className={cn(attachmentItemVariants({ variant }), className)} {...props}>
        {children}
      </div>
    </AttachmentItemContext>
  );
};

AttachmentItem.displayName = 'AttachmentItem';

const AttachmentPreview = ({
  className,
  fallbackIcon,
  ref,
  ...props
}: AttachmentPreviewProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { data, variant } = useAttachment();
  const size = variant === 'inline' ? 'size-7' : 'size-9';

  return (
    <div
      ref={ref}
      className={cn(
        'bg-muted text-muted-foreground flex shrink-0 items-center justify-center overflow-hidden rounded-sm',
        variant === 'inline' && 'rounded-full',
        size,
        className,
      )}
      {...props}
    >
      {isImage(data) && data.url ? (
        <img src={data.url} alt={attachmentLabel(data)} className="size-full object-cover" />
      ) : (
        (fallbackIcon ?? <FileIcon size={16} />)
      )}
    </div>
  );
};

AttachmentPreview.displayName = 'AttachmentPreview';

const AttachmentInfo = ({
  className,
  showMediaType = false,
  children,
  ref,
  ...props
}: AttachmentInfoProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { data } = useAttachment();

  const meta = [
    showMediaType ? data.mediaType : undefined,
    data.size === undefined ? undefined : formatSize(data.size),
  ].filter(Boolean);

  return (
    <div ref={ref} className={cn('flex min-w-0 flex-col', className)} {...props}>
      {children ?? (
        <>
          <span className="text-foreground truncate text-xs font-medium">
            {attachmentLabel(data)}
          </span>
          {meta.length > 0 && (
            <span className="text-muted-foreground truncate text-[11px]">{meta.join(' · ')}</span>
          )}
        </>
      )}
    </div>
  );
};

AttachmentInfo.displayName = 'AttachmentInfo';

const AttachmentRemove = ({
  className,
  label = 'Remove',
  children,
  onClick,
  ref,
  ...props
}: AttachmentRemoveProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { data, onRemove, variant } = useAttachment();

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${label} ${attachmentLabel(data)}`}
      onClick={(event) => {
        onRemove?.();
        onClick?.(event);
      }}
      className={cn(
        'border-border bg-background text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none',
        variant === 'grid' &&
          'absolute -top-2 -right-2 opacity-0 group-hover/attachment:opacity-100 focus-visible:opacity-100',
        variant === 'list' && 'ml-auto',
        className,
      )}
      {...props}
    >
      {children ?? <XIcon size={12} />}
    </button>
  );
};

AttachmentRemove.displayName = 'AttachmentRemove';

const AttachmentEmpty = ({
  className,
  children,
  ref,
  ...props
}: AttachmentEmptyProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-border text-muted-foreground flex w-full items-center justify-center rounded-md border border-dashed px-4 py-6 text-xs',
        className,
      )}
      {...props}
    >
      {children ?? 'No attachments yet'}
    </div>
  );
};

AttachmentEmpty.displayName = 'AttachmentEmpty';

const Attachments = Object.assign(AttachmentsRoot, {
  Item: AttachmentItem,
  Preview: AttachmentPreview,
  Info: AttachmentInfo,
  Remove: AttachmentRemove,
  Empty: AttachmentEmpty,
});

export { Attachments, attachmentLabel, attachmentsVariants, formatSize, useAttachment };
export type {
  AttachmentData,
  AttachmentEmptyProps,
  AttachmentInfoProps,
  AttachmentItemProps,
  AttachmentPreviewProps,
  AttachmentRemoveProps,
  AttachmentsProps,
};
