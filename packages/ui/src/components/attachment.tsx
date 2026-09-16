'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ArchiveIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <rect x="2.5" y="3.5" width="19" height="5.5" rx="2" />
      <path d="M4 9v8.5a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9" />
      <path d="M10 13.5h4" />
    </svg>
  );
}

function DownloadIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M12 3v11" />
      <path d="m8 10.5 4 4 4-4" />
      <path d="M3.5 15v1.5A3.5 3.5 0 0 0 7 20h10a3.5 3.5 0 0 0 3.5-3.5V15" />
    </svg>
  );
}

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
      <path d="M13.5 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8.5L13.5 3Z" />
      <path d="M13.5 3v3.5a2 2 0 0 0 2 2H19" />
    </svg>
  );
}

function FileTextIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M13.5 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8.5L13.5 3Z" />
      <path d="M13.5 3v3.5a2 2 0 0 0 2 2H19" />
      <path d="M8.5 13h7" />
      <path d="M8.5 17h4" />
    </svg>
  );
}

function ImageIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" />
      <circle cx="8.5" cy="9" r="2" />
      <path d="m21.5 14.5-3.4-3.4a2 2 0 0 0-2.8 0L7 19.4" />
    </svg>
  );
}

function MusicIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="6.5" cy="17.5" r="3" />
      <circle cx="17.5" cy="15.5" r="3" />
      <path d="M9.5 17.5V7.2a2 2 0 0 1 1.5-1.9l8-2a2 2 0 0 1 1.5 1.9v10.3" />
    </svg>
  );
}

function VideoIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <rect x="2.5" y="5.5" width="13" height="13" rx="3" />
      <path d="m15.5 10 4.4-2.6a1 1 0 0 1 1.6.9v7.4a1 1 0 0 1-1.6.9L15.5 14" />
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

function iconForType(
  type: string | undefined,
  name: string | undefined,
): React.ComponentType<IconProps> {
  const mime = (type ?? '').toLowerCase();
  const extension = (name ?? '').toLowerCase().split('.').pop() ?? '';

  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('video/')) return VideoIcon;
  if (mime.startsWith('audio/')) return MusicIcon;
  if (mime === 'application/pdf' || extension === 'pdf') return FileTextIcon;
  if (
    mime.includes('zip') ||
    mime.includes('compressed') ||
    ['zip', 'rar', '7z', 'gz', 'tar'].includes(extension)
  ) {
    return ArchiveIcon;
  }
  return FileIcon;
}

function AttachmentTypeIcon({ type, name }: { type?: string; name?: string }) {
  const Icon = iconForType(type, name);
  return <Icon aria-hidden="true" />;
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
          <AttachmentTypeIcon type={type} name={name} />
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
      {children ?? <XIcon aria-hidden="true" />}
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
      {children ?? <DownloadIcon aria-hidden="true" />}
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
