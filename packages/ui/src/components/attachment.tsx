'use client';

import {
  Cancel01Icon,
  Download01Icon,
  File01Icon,
  FileZipIcon,
  Image01Icon,
  MusicNote01Icon,
  Pdf01Icon,
  Video01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type AttachmentVariant = 'row' | 'card' | 'chip';
type AttachmentStatus = 'idle' | 'uploading' | 'done' | 'error';

interface AttachmentContextValue {
  variant: AttachmentVariant;
  status: AttachmentStatus;
}

const AttachmentContext = React.createContext<AttachmentContextValue | null>(null);

function useAttachmentContext(): AttachmentContextValue {
  const context = React.use(AttachmentContext);
  if (!context) throw new Error('Attachment parts must be used within Attachment');
  return context;
}

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

function formatFileSize(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
  const value = bytes / 1024 ** exponent;
  const rounded = exponent === 0 ? value : Number(value.toFixed(decimals));
  return `${rounded} ${SIZE_UNITS[exponent]}`;
}

function iconForType(type: string | undefined, name: string | undefined): IconSvgElement {
  const mime = (type ?? '').toLowerCase();
  const extension = (name ?? '').toLowerCase().split('.').pop() ?? '';

  if (mime.startsWith('image/')) return Image01Icon;
  if (mime.startsWith('video/')) return Video01Icon;
  if (mime.startsWith('audio/')) return MusicNote01Icon;
  if (mime === 'application/pdf' || extension === 'pdf') return Pdf01Icon;
  if (
    mime.includes('zip') ||
    mime.includes('compressed') ||
    ['zip', 'rar', '7z', 'gz', 'tar'].includes(extension)
  ) {
    return FileZipIcon;
  }
  return File01Icon;
}

interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AttachmentVariant;
  status?: AttachmentStatus;
}

const AttachmentRoot = ({
  variant = 'row',
  status = 'idle',
  className,
  ref,
  ...props
}: AttachmentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const context = React.useMemo(() => ({ variant, status }), [variant, status]);

  return (
    <AttachmentContext value={context}>
      <div
        ref={ref}
        data-slot="attachment"
        data-variant={variant}
        data-status={status}
        className={cn(
          'group/attachment border-border bg-card text-card-foreground relative overflow-hidden border transition-colors',
          'data-[status=error]:border-destructive/60 data-[status=uploading]:text-muted-foreground',
          variant === 'row' && 'flex items-center gap-3 rounded-lg p-2.5 pr-2',
          variant === 'card' && 'flex w-40 flex-col rounded-xl',
          variant === 'chip' &&
            'inline-flex h-8 max-w-60 items-center gap-1.5 rounded-full py-1 pr-1 pl-1.5',
          className,
        )}
        {...props}
      />
    </AttachmentContext>
  );
};
AttachmentRoot.displayName = 'Attachment';

interface AttachmentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  type?: string;
  name?: string;
  alt?: string;
}

const AttachmentPreview = ({
  src,
  type,
  name,
  alt,
  className,
  children,
  ref,
  ...props
}: AttachmentPreviewProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { variant } = useAttachmentContext();
  const isImage = Boolean(src);

  return (
    <div
      ref={ref}
      data-slot="attachment-preview"
      data-kind={isImage ? 'image' : 'icon'}
      className={cn(
        'bg-muted text-muted-foreground flex shrink-0 items-center justify-center overflow-hidden',
        variant === 'row' && 'size-10 rounded-md [&_svg]:size-5',
        variant === 'card' && 'aspect-square w-full [&_svg]:size-8',
        variant === 'chip' && 'size-6 rounded-full [&_svg]:size-3.5',
        className,
      )}
      {...props}
    >
      {children ??
        (isImage ? (
          <img src={src} alt={alt ?? name ?? ''} className="size-full object-cover" />
        ) : (
          <HugeiconsIcon icon={iconForType(type, name)} aria-hidden="true" />
        ))}
    </div>
  );
};
AttachmentPreview.displayName = 'AttachmentPreview';

const AttachmentContent = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => {
  const { variant } = useAttachmentContext();

  return (
    <div
      ref={ref}
      data-slot="attachment-content"
      className={cn(
        'flex min-w-0 flex-1 flex-col',
        variant === 'row' && 'gap-0.5',
        variant === 'card' && 'gap-0.5 p-2.5',
        variant === 'chip' && 'flex-row items-baseline gap-1',
        className,
      )}
      {...props}
    />
  );
};
AttachmentContent.displayName = 'AttachmentContent';

const AttachmentName = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const { variant } = useAttachmentContext();

  return (
    <p
      ref={ref}
      data-slot="attachment-name"
      className={cn('truncate font-medium', variant === 'chip' ? 'text-xs' : 'text-sm', className)}
      {...props}
    />
  );
};
AttachmentName.displayName = 'AttachmentName';

const AttachmentMeta = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) => (
  <p
    ref={ref}
    data-slot="attachment-meta"
    className={cn('text-muted-foreground truncate text-xs', className)}
    {...props}
  />
);
AttachmentMeta.displayName = 'AttachmentMeta';

interface AttachmentSizeProps extends React.HTMLAttributes<HTMLSpanElement> {
  bytes: number;
  decimals?: number;
}

const AttachmentSize = ({
  bytes,
  decimals,
  className,
  ref,
  ...props
}: AttachmentSizeProps & { ref?: React.Ref<HTMLSpanElement> }) => (
  <span
    ref={ref}
    data-slot="attachment-size"
    className={cn('text-muted-foreground text-xs tabular-nums', className)}
    {...props}
  >
    {formatFileSize(bytes, decimals)}
  </span>
);
AttachmentSize.displayName = 'AttachmentSize';

const AttachmentActions = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => {
  const { variant } = useAttachmentContext();

  return (
    <div
      ref={ref}
      data-slot="attachment-actions"
      className={cn(
        'flex shrink-0 items-center gap-0.5',
        variant === 'card' &&
          'absolute top-1.5 right-1.5 opacity-0 transition-opacity group-focus-within/attachment:opacity-100 group-hover/attachment:opacity-100',
        className,
      )}
      {...props}
    />
  );
};
AttachmentActions.displayName = 'AttachmentActions';

const actionClassName =
  'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';

const AttachmentRemove = ({
  className,
  children,
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { variant } = useAttachmentContext();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Remove attachment"
      data-slot="attachment-remove"
      className={cn(
        actionClassName,
        variant === 'chip' ? 'size-5 [&_svg]:size-3' : 'size-7 [&_svg]:size-3.5',
        variant === 'card' && 'bg-background/80 backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />}
    </button>
  );
};
AttachmentRemove.displayName = 'AttachmentRemove';

const AttachmentDownload = ({
  className,
  children,
  ref,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { ref?: React.Ref<HTMLAnchorElement> }) => {
  const { variant } = useAttachmentContext();

  return (
    <a
      ref={ref}
      download
      aria-label="Download attachment"
      data-slot="attachment-download"
      className={cn(
        actionClassName,
        variant === 'chip' ? 'size-5 [&_svg]:size-3' : 'size-7 [&_svg]:size-3.5',
        variant === 'card' && 'bg-background/80 backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={Download01Icon} aria-hidden="true" />}
    </a>
  );
};
AttachmentDownload.displayName = 'AttachmentDownload';

interface AttachmentProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

const AttachmentProgress = ({
  value,
  className,
  ref,
  ...props
}: AttachmentProgressProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      data-slot="attachment-progress"
      className={cn('bg-muted absolute inset-x-0 bottom-0 h-0.5', className)}
      {...props}
    >
      <div
        className="bg-primary h-full transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
AttachmentProgress.displayName = 'AttachmentProgress';

interface AttachmentListProps extends React.HTMLAttributes<HTMLUListElement> {
  layout?: 'stack' | 'grid' | 'inline';
}

const AttachmentList = ({
  layout = 'stack',
  className,
  ref,
  ...props
}: AttachmentListProps & { ref?: React.Ref<HTMLUListElement> }) => (
  <ul
    ref={ref}
    data-slot="attachment-list"
    data-layout={layout}
    className={cn(
      'm-0 list-none p-0',
      layout === 'stack' && 'flex flex-col gap-2',
      layout === 'grid' && 'flex flex-wrap gap-3',
      layout === 'inline' && 'flex flex-wrap items-center gap-1.5',
      className,
    )}
    {...props}
  />
);
AttachmentList.displayName = 'AttachmentList';

const AttachmentItem = ({
  className,
  ref,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & { ref?: React.Ref<HTMLLIElement> }) => (
  <li ref={ref} data-slot="attachment-item" className={cn('min-w-0', className)} {...props} />
);
AttachmentItem.displayName = 'AttachmentItem';

const Attachment = Object.assign(AttachmentRoot, {
  Preview: AttachmentPreview,
  Content: AttachmentContent,
  Name: AttachmentName,
  Meta: AttachmentMeta,
  Size: AttachmentSize,
  Actions: AttachmentActions,
  Remove: AttachmentRemove,
  Download: AttachmentDownload,
  Progress: AttachmentProgress,
  List: AttachmentList,
  Item: AttachmentItem,
});

export { Attachment, formatFileSize, useAttachmentContext };
export type {
  AttachmentProps,
  AttachmentVariant,
  AttachmentStatus,
  AttachmentPreviewProps,
  AttachmentSizeProps,
  AttachmentProgressProps,
  AttachmentListProps,
};
