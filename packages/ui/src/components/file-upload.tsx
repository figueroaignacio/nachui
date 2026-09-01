'use client';

import { Cancel01Icon, File01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileWithPreview {
  id: string;
  file: File | FileMetadata;
  preview?: string;
}

interface UseFileUploadOptions {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  initialFiles?: FileMetadata[];
  disabled?: boolean;
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesAdded?: (files: FileWithPreview[]) => void;
  onError?: (errors: string[]) => void;
}

interface FileUploadInputProps {
  ref: React.RefObject<HTMLInputElement | null>;
  type: 'file';
  accept: string | undefined;
  multiple: boolean;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FileUploadDropzoneHandlers {
  onDragEnter: (event: React.DragEvent<HTMLElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLElement>) => void;
  onDrop: (event: React.DragEvent<HTMLElement>) => void;
}

interface UseFileUploadReturn {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  openFileDialog: () => void;
  getInputProps: () => FileUploadInputProps;
  getDropzoneProps: () => FileUploadDropzoneHandlers;
  handleDragEnter: (event: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLElement>) => void;
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
  const value = bytes / 1024 ** exponent;
  const rounded = exponent === 0 ? value : Number(value.toFixed(decimals));
  return `${rounded} ${BYTE_UNITS[exponent]}`;
}

function isFileMetadata(file: File | FileMetadata): file is FileMetadata {
  return typeof File === 'undefined' || !(file instanceof File);
}

function getFileId(file: File | FileMetadata): string {
  if (isFileMetadata(file)) return file.id;
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function getFilePreview(file: File | FileMetadata): string | undefined {
  if (isFileMetadata(file)) return file.type.startsWith('image/') ? file.url : undefined;
  if (!file.type.startsWith('image/')) return undefined;
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return undefined;
  return URL.createObjectURL(file);
}

function revokePreview(entry: FileWithPreview) {
  if (!entry.preview || isFileMetadata(entry.file)) return;
  if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(entry.preview);
  }
}

function matchesAccept(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0 || rules.includes('*') || rules.includes('*/*')) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

function validateFile(file: File, accept: string | undefined, maxSize: number): string | null {
  if (file.size > maxSize) {
    return `"${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;
  }
  if (accept && !matchesAccept(file, accept)) {
    return `"${file.name}" is not an accepted file type.`;
  }
  return null;
}

function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    accept,
    multiple = false,
    maxFiles = Infinity,
    maxSize = Infinity,
    initialFiles = [],
    disabled = false,
    onFilesChange,
    onFilesAdded,
    onError,
  } = options;

  const [files, setFiles] = React.useState<FileWithPreview[]>(() =>
    initialFiles.map((file) => ({ id: file.id, file, preview: getFilePreview(file) })),
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragDepth = React.useRef(0);

  const commit = React.useCallback(
    (next: FileWithPreview[]) => {
      setFiles(next);
      onFilesChange?.(next);
    },
    [onFilesChange],
  );

  const reportErrors = React.useCallback(
    (next: string[]) => {
      setErrors(next);
      if (next.length > 0) onError?.(next);
    },
    [onError],
  );

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return;
      const candidates = Array.from(incoming);
      if (candidates.length === 0) return;

      const batch = multiple ? candidates : candidates.slice(0, 1);
      const nextErrors: string[] = [];

      if (multiple && files.length + batch.length > maxFiles) {
        reportErrors([`You can upload a maximum of ${maxFiles} files.`]);
        return;
      }

      const accepted: FileWithPreview[] = [];
      for (const file of batch) {
        const id = getFileId(file);
        if (multiple && files.some((entry) => entry.id === id)) {
          nextErrors.push(`"${file.name}" is already in the list.`);
          continue;
        }
        const problem = validateFile(file, accept, maxSize);
        if (problem) {
          nextErrors.push(problem);
          continue;
        }
        accepted.push({ id, file, preview: getFilePreview(file) });
      }

      if (accepted.length > 0) {
        if (!multiple) files.forEach(revokePreview);
        const next = multiple ? [...files, ...accepted] : accepted;
        commit(next);
        onFilesAdded?.(accepted);
      }

      reportErrors(nextErrors);
    },
    [accept, commit, disabled, files, maxFiles, maxSize, multiple, onFilesAdded, reportErrors],
  );

  const removeFile = React.useCallback(
    (id: string) => {
      const target = files.find((entry) => entry.id === id);
      if (!target) return;
      revokePreview(target);
      commit(files.filter((entry) => entry.id !== id));
      setErrors([]);
    },
    [commit, files],
  );

  const clearFiles = React.useCallback(() => {
    files.forEach(revokePreview);
    if (inputRef.current) inputRef.current.value = '';
    commit([]);
    setErrors([]);
  }, [commit, files]);

  const clearErrors = React.useCallback(() => setErrors([]), []);

  const openFileDialog = React.useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      dragDepth.current += 1;
      if (!disabled && event.dataTransfer.items.length > 0) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = React.useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = React.useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      dragDepth.current = 0;
      setIsDragging(false);
      if (disabled) return;
      addFiles(event.dataTransfer.files);
    },
    [addFiles, disabled],
  );

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) addFiles(event.target.files);
      event.target.value = '';
    },
    [addFiles],
  );

  const getInputProps = React.useCallback(
    (): FileUploadInputProps => ({
      ref: inputRef,
      type: 'file',
      accept,
      multiple,
      disabled,
      onChange,
    }),
    [accept, disabled, multiple, onChange],
  );

  const getDropzoneProps = React.useCallback(
    (): FileUploadDropzoneHandlers => ({
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    }),
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop],
  );

  return {
    files,
    isDragging,
    errors,
    disabled,
    inputRef,
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
    openFileDialog,
    getInputProps,
    getDropzoneProps,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}

const FileUploadContext = React.createContext<UseFileUploadReturn | null>(null);
const FileUploadItemContext = React.createContext<FileWithPreview | null>(null);

function useFileUploadContext(): UseFileUploadReturn {
  const context = React.use(FileUploadContext);
  if (!context) throw new Error('FileUpload components must be used within FileUpload');
  return context;
}

function useFileUploadItemContext(): FileWithPreview {
  const context = React.use(FileUploadItemContext);
  if (!context) throw new Error('FileUpload item parts must be used within FileUpload.Item');
  return context;
}

interface FileUploadProps
  extends UseFileUploadOptions, Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  name?: string;
}

const FileUploadRoot = ({
  accept,
  multiple,
  maxFiles,
  maxSize,
  initialFiles,
  disabled,
  onFilesChange,
  onFilesAdded,
  onError,
  name,
  className,
  children,
  ref,
  ...props
}: FileUploadProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const upload = useFileUpload({
    accept,
    multiple,
    maxFiles,
    maxSize,
    initialFiles,
    disabled,
    onFilesChange,
    onFilesAdded,
    onError,
  });

  return (
    <FileUploadContext value={upload}>
      <div
        ref={ref}
        data-slot="file-upload"
        data-disabled={disabled ? '' : undefined}
        className={cn('flex w-full flex-col gap-3', className)}
        {...props}
      >
        <input {...upload.getInputProps()} name={name} tabIndex={-1} className="sr-only" />
        {children}
      </div>
    </FileUploadContext>
  );
};

FileUploadRoot.displayName = 'FileUpload';

type FileUploadDropzoneProps = React.HTMLAttributes<HTMLDivElement>;

const FileUploadDropzone = ({
  className,
  onClick,
  onKeyDown,
  ref,
  ...props
}: FileUploadDropzoneProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { disabled, isDragging, openFileDialog, getDropzoneProps } = useFileUploadContext();

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      data-slot="file-upload-dropzone"
      data-dragging={isDragging ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'border-border bg-card text-muted-foreground flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-sm transition-colors outline-none',
        'hover:bg-muted/50 focus-visible:ring-ring ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
        'data-[dragging]:border-primary data-[dragging]:bg-primary/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '[&_svg]:size-6',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openFileDialog();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openFileDialog();
        }
      }}
      {...getDropzoneProps()}
      {...props}
    />
  );
};

FileUploadDropzone.displayName = 'FileUploadDropzone';

type FileUploadTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const FileUploadTrigger = ({
  className,
  onClick,
  disabled: disabledProp,
  ref,
  ...props
}: FileUploadTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { disabled, openFileDialog } = useFileUploadContext();

  return (
    <button
      ref={ref}
      type="button"
      data-slot="file-upload-trigger"
      disabled={disabled || disabledProp}
      className={cn(
        'border-border text-foreground hover:bg-muted focus-visible:ring-ring ring-offset-background inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-transparent px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openFileDialog();
      }}
      {...props}
    />
  );
};

FileUploadTrigger.displayName = 'FileUploadTrigger';

interface FileUploadListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  children?: React.ReactNode | ((file: FileWithPreview) => React.ReactNode);
}

const FileUploadList = ({
  className,
  children,
  ref,
  ...props
}: FileUploadListProps & { ref?: React.Ref<HTMLUListElement> }) => {
  const { files } = useFileUploadContext();

  if (files.length === 0) return null;

  let content: React.ReactNode;
  if (typeof children === 'function') {
    content = files.map((file) => <React.Fragment key={file.id}>{children(file)}</React.Fragment>);
  } else if (children === undefined) {
    content = files.map((file) => <FileUploadItem key={file.id} file={file} />);
  } else {
    content = children;
  }

  return (
    <ul
      ref={ref}
      data-slot="file-upload-list"
      className={cn('m-0 flex list-none flex-col gap-2 p-0', className)}
      {...props}
    >
      {content}
    </ul>
  );
};

FileUploadList.displayName = 'FileUploadList';

interface FileUploadItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  file: FileWithPreview;
}

const FileUploadItem = ({
  file,
  className,
  children,
  ref,
  ...props
}: FileUploadItemProps & { ref?: React.Ref<HTMLLIElement> }) => {
  return (
    <FileUploadItemContext value={file}>
      <li
        ref={ref}
        data-slot="file-upload-item"
        className={cn(
          'border-border bg-card flex items-center gap-3 rounded-lg border p-3',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <FileUploadItemPreview />
            <FileUploadItemInfo />
            <FileUploadItemRemove />
          </>
        )}
      </li>
    </FileUploadItemContext>
  );
};

FileUploadItem.displayName = 'FileUploadItem';

type FileUploadItemPreviewProps = React.HTMLAttributes<HTMLDivElement>;

const FileUploadItemPreview = ({
  className,
  children,
  ref,
  ...props
}: FileUploadItemPreviewProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { preview } = useFileUploadItemContext();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="file-upload-item-preview"
      className={cn(
        'bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md [&_svg]:size-5',
        className,
      )}
      {...props}
    >
      {preview ? (
        <img src={preview} alt="" className="size-full object-cover" />
      ) : (
        (children ?? <HugeiconsIcon icon={File01Icon} strokeWidth={1.5} />)
      )}
    </div>
  );
};

FileUploadItemPreview.displayName = 'FileUploadItemPreview';

type FileUploadItemInfoProps = React.HTMLAttributes<HTMLDivElement>;

const FileUploadItemInfo = ({
  className,
  children,
  ref,
  ...props
}: FileUploadItemInfoProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { file } = useFileUploadItemContext();

  return (
    <div
      ref={ref}
      data-slot="file-upload-item-info"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    >
      <span className="text-foreground truncate text-sm font-medium">{file.name}</span>
      <span className="text-muted-foreground text-xs">{formatBytes(file.size)}</span>
      {children}
    </div>
  );
};

FileUploadItemInfo.displayName = 'FileUploadItemInfo';

type FileUploadItemRemoveProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const FileUploadItemRemove = ({
  className,
  onClick,
  children,
  ref,
  ...props
}: FileUploadItemRemoveProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { removeFile, disabled } = useFileUploadContext();
  const { id } = useFileUploadItemContext();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Remove file"
      data-slot="file-upload-item-remove"
      disabled={disabled}
      className={cn(
        'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) removeFile(id);
      }}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />}
    </button>
  );
};

FileUploadItemRemove.displayName = 'FileUploadItemRemove';

type FileUploadErrorsProps = React.HTMLAttributes<HTMLUListElement>;

const FileUploadErrors = ({
  className,
  ref,
  ...props
}: FileUploadErrorsProps & { ref?: React.Ref<HTMLUListElement> }) => {
  const { errors } = useFileUploadContext();

  if (errors.length === 0) return null;

  return (
    <ul
      ref={ref}
      role="alert"
      data-slot="file-upload-errors"
      className={cn(
        'text-destructive-text m-0 flex list-none flex-col gap-1 p-0 text-xs',
        className,
      )}
      {...props}
    >
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
};

FileUploadErrors.displayName = 'FileUploadErrors';

type FileUploadClearProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const FileUploadClear = ({
  className,
  onClick,
  ref,
  ...props
}: FileUploadClearProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { files, clearFiles, disabled } = useFileUploadContext();

  if (files.length === 0) return null;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="file-upload-clear"
      disabled={disabled}
      className={cn(
        'text-muted-foreground hover:text-foreground self-start text-xs underline-offset-4 transition-colors hover:underline disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) clearFiles();
      }}
      {...props}
    />
  );
};

FileUploadClear.displayName = 'FileUploadClear';

const FileUpload = Object.assign(FileUploadRoot, {
  Dropzone: FileUploadDropzone,
  Trigger: FileUploadTrigger,
  List: FileUploadList,
  Item: FileUploadItem,
  ItemPreview: FileUploadItemPreview,
  ItemInfo: FileUploadItemInfo,
  ItemRemove: FileUploadItemRemove,
  Errors: FileUploadErrors,
  Clear: FileUploadClear,
});

export { FileUpload, formatBytes, useFileUpload, useFileUploadContext, useFileUploadItemContext };
export type {
  FileMetadata,
  FileUploadClearProps,
  FileUploadDropzoneHandlers,
  FileUploadDropzoneProps,
  FileUploadErrorsProps,
  FileUploadItemInfoProps,
  FileUploadItemPreviewProps,
  FileUploadItemProps,
  FileUploadItemRemoveProps,
  FileUploadListProps,
  FileUploadProps,
  FileUploadTriggerProps,
  FileWithPreview,
  UseFileUploadOptions,
  UseFileUploadReturn,
};
