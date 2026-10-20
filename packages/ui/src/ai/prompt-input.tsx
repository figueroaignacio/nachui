'use client';

import * as React from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function PaperclipIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M20 11.5 12.5 19a4.5 4.5 0 0 1-6.4-6.4l7.6-7.6a3 3 0 0 1 4.3 4.3l-7.6 7.6a1.5 1.5 0 0 1-2.1-2.1l7-7" />
    </svg>
  );
}

function SendIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SquareIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <rect x="7" y="7" width="10" height="10" rx="2" />
    </svg>
  );
}

function LoaderIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

function AlertIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
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

type PromptInputStatus = 'ready' | 'submitted' | 'streaming' | 'error';
type PromptInputErrorCode = 'max_files' | 'max_file_size' | 'accept';

interface PromptInputError {
  code: PromptInputErrorCode;
  message: string;
}

interface PromptInputFile {
  id: string;
  filename: string;
  mediaType: string;
  size: number;
  url: string;
  file: File;
}

interface PromptInputMessage {
  text: string;
  files: PromptInputFile[];
}

interface PromptInputContextValue {
  text: string;
  setText: (text: string) => void;
  files: PromptInputFile[];
  add: (files: FileList | File[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  dragging: boolean;
  accept: string | undefined;
  id: string;
  status: PromptInputStatus | undefined;
  disabled: boolean;
  reportSubmitStatus: (status: PromptInputStatus | undefined) => void;
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null);

const usePromptInput = (): PromptInputContextValue => {
  const context = React.use(PromptInputContext);
  if (!context) {
    throw new Error('PromptInput components must be used within PromptInput');
  }
  return context;
};

const usePromptInputAttachments = () => {
  const { files, add, remove, clear, openFileDialog } = usePromptInput();
  return { files, add, remove, clear, openFileDialog };
};

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(',').some((rule) => {
    const pattern = rule.trim();
    if (!pattern) return false;
    if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
    return file.type === pattern;
  });
}

interface PromptInputProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'onError' | 'value' | 'defaultValue'
> {
  onSubmit?: (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>,
  ) => void | boolean | Promise<void | boolean>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  globalDrop?: boolean;
  clearOnSubmit?: boolean;
  onError?: (error: PromptInputError) => void;
  status?: PromptInputStatus;
  disabled?: boolean;
}

type PromptInputHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type PromptInputBodyProps = React.HTMLAttributes<HTMLDivElement>;
type PromptInputFooterProps = React.HTMLAttributes<HTMLDivElement>;
type PromptInputToolsProps = React.HTMLAttributes<HTMLDivElement>;
type PromptInputAttachmentsProps = React.HTMLAttributes<HTMLDivElement>;

interface PromptInputTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange'
> {
  minRows?: number;
  maxRows?: number;
  label?: string;
  submitOnEnter?: boolean;
}

interface PromptInputButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: 'ghost' | 'outline';
}

interface PromptInputAddAttachmentsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

interface PromptInputSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: PromptInputStatus;
  label?: string;
  stopLabel?: string;
  onStop?: () => void;
}

const PromptInputRoot = ({
  className,
  onSubmit,
  accept,
  multiple = false,
  maxFiles,
  maxFileSize,
  globalDrop = false,
  clearOnSubmit = true,
  onError,
  value: controlledText,
  defaultValue = '',
  onValueChange,
  status,
  disabled = false,
  children,
  ref,
  ...props
}: PromptInputProps & { ref?: React.Ref<HTMLFormElement> }) => {
  const [text, setText] = useControllableState({
    value: controlledText,
    defaultValue,
    onChange: onValueChange,
  });
  const [files, setFiles] = React.useState<PromptInputFile[]>([]);
  const filesRef = React.useRef<PromptInputFile[]>(files);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const id = React.useId();
  const counterRef = React.useRef(0);
  const handedOffRef = React.useRef(new Set<string>());
  const submitStatusRef = React.useRef<PromptInputStatus | undefined>(undefined);

  const release = React.useCallback((entry: PromptInputFile) => {
    if (handedOffRef.current.has(entry.url)) return;
    URL.revokeObjectURL(entry.url);
  }, []);

  const reportSubmitStatus = React.useCallback((next: PromptInputStatus | undefined) => {
    submitStatusRef.current = next;
  }, []);

  const add = React.useCallback(
    (incoming: FileList | File[]) => {
      const next = [...filesRef.current];

      for (const file of Array.from(incoming)) {
        if (!matchesAccept(file, accept)) {
          onError?.({ code: 'accept', message: `${file.name} is not an accepted file type.` });
          continue;
        }
        if (maxFileSize !== undefined && file.size > maxFileSize) {
          onError?.({ code: 'max_file_size', message: `${file.name} is too large.` });
          continue;
        }
        if (maxFiles !== undefined && next.length >= maxFiles) {
          onError?.({ code: 'max_files', message: `You can attach up to ${maxFiles} files.` });
          break;
        }

        counterRef.current += 1;
        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${counterRef.current}`,
          filename: file.name,
          mediaType: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          file,
        });

        if (!multiple) break;
      }

      const accepted = multiple ? next : next.slice(-1);
      for (const entry of next) {
        if (!accepted.includes(entry)) release(entry);
      }

      filesRef.current = accepted;
      setFiles(accepted);
    },
    [accept, maxFileSize, maxFiles, multiple, onError, release],
  );

  const remove = React.useCallback(
    (fileId: string) => {
      const target = filesRef.current.find((entry) => entry.id === fileId);
      if (target) release(target);
      filesRef.current = filesRef.current.filter((entry) => entry.id !== fileId);
      setFiles(filesRef.current);
    },
    [release],
  );

  const clear = React.useCallback(() => {
    for (const entry of filesRef.current) release(entry);
    filesRef.current = [];
    setFiles(filesRef.current);
  }, [release]);

  React.useEffect(
    () => () => {
      for (const entry of filesRef.current) release(entry);
    },
    [release],
  );

  const openFileDialog = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  React.useEffect(() => {
    if (!globalDrop) return;

    const onWindowDrop = (event: DragEvent) => {
      if (!event.dataTransfer?.files.length) return;
      event.preventDefault();
      add(event.dataTransfer.files);
      setDragging(false);
    };
    const onWindowDragOver = (event: DragEvent) => event.preventDefault();

    window.addEventListener('drop', onWindowDrop);
    window.addEventListener('dragover', onWindowDragOver);
    return () => {
      window.removeEventListener('drop', onWindowDrop);
      window.removeEventListener('dragover', onWindowDragOver);
    };
  }, [add, globalDrop]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const current = status ?? submitStatusRef.current;
    if (disabled || current === 'streaming' || current === 'submitted') return;
    if (!text.trim() && files.length === 0) return;
    const submitted = files;
    for (const entry of submitted) handedOffRef.current.add(entry.url);
    const result = onSubmit?.({ text, files: submitted }, event);
    if (!clearOnSubmit) return;
    const reset = (outcome: void | boolean) => {
      if (outcome === false) return;
      setText('');
      filesRef.current = filesRef.current.filter((entry) => !submitted.includes(entry));
      setFiles(filesRef.current);
    };
    if (result instanceof Promise) {
      result.then(reset, () => undefined);
    } else {
      reset(result);
    }
  };

  const value = React.useMemo<PromptInputContextValue>(
    () => ({
      text,
      setText,
      files,
      add,
      remove,
      clear,
      openFileDialog,
      dragging,
      accept,
      id,
      status,
      disabled,
      reportSubmitStatus,
    }),
    [
      text,
      setText,
      files,
      add,
      remove,
      clear,
      openFileDialog,
      dragging,
      accept,
      id,
      status,
      disabled,
      reportSubmitStatus,
    ],
  );

  return (
    <PromptInputContext value={value}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        data-dragging={dragging ? '' : undefined}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length > 0) add(event.dataTransfer.files);
        }}
        className={cn(
          'border-input bg-background focus-within:border-border-interactive flex w-full flex-col rounded-xl border transition-colors',
          dragging && 'border-ring bg-muted/40',
          className,
        )}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          tabIndex={-1}
          hidden
          onChange={(event) => {
            if (event.target.files) add(event.target.files);
            event.target.value = '';
          }}
        />
        {children}
      </form>
    </PromptInputContext>
  );
};

PromptInputRoot.displayName = 'PromptInput';

const PromptInputHeader = ({
  className,
  ref,
  ...props
}: PromptInputHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex flex-col gap-2 px-3 pt-3', className)} {...props} />;
};

PromptInputHeader.displayName = 'PromptInputHeader';

const PromptInputBody = ({
  className,
  ref,
  ...props
}: PromptInputBodyProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex w-full min-w-0 flex-col', className)} {...props} />;
};

PromptInputBody.displayName = 'PromptInputBody';

const PromptInputFooter = ({
  className,
  ref,
  ...props
}: PromptInputFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-2 px-2 pt-1 pb-2', className)}
      {...props}
    />
  );
};

PromptInputFooter.displayName = 'PromptInputFooter';

const PromptInputTools = ({
  className,
  ref,
  ...props
}: PromptInputToolsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex items-center gap-1', className)} {...props} />;
};

PromptInputTools.displayName = 'PromptInputTools';

const PromptInputAttachments = ({
  className,
  children,
  ref,
  ...props
}: PromptInputAttachmentsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { files, remove, id } = usePromptInput();
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const removeAndRefocus = (fileId: string, index: number) => {
    const buttons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[data-prompt-input-remove]') ?? [],
    );
    const next = buttons[index + 1] ?? buttons[index - 1];
    remove(fileId);
    if (next) next.focus();
    else document.getElementById(`${id}-textarea`)?.focus();
  };

  if (files.length === 0) return null;

  return (
    <div ref={setRefs} className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
      {children ??
        files.map((file, index) => (
          <span
            key={file.id}
            className="border-border bg-secondary text-secondary-foreground flex h-8 max-w-48 items-center gap-1.5 rounded-full border py-1 pr-1 pl-2.5 text-xs"
          >
            <span className="truncate">{file.filename}</span>
            <button
              type="button"
              aria-label={`Remove ${file.filename}`}
              data-prompt-input-remove=""
              onClick={() => removeAndRefocus(file.id, index)}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring relative flex size-5 shrink-0 items-center justify-center rounded-full transition-colors after:absolute after:-inset-2 focus-visible:ring-2 focus-visible:outline-none"
            >
              <XIcon size={12} />
            </button>
          </span>
        ))}
    </div>
  );
};

PromptInputAttachments.displayName = 'PromptInputAttachments';

const PromptInputTextarea = ({
  className,
  minRows = 1,
  maxRows = 8,
  label = 'Message',
  submitOnEnter,
  disabled,
  onKeyDown,
  ref,
  ...props
}: PromptInputTextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) => {
  const { text, setText, id, disabled: rootDisabled } = usePromptInput();
  const innerRef = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  const resize = React.useCallback(() => {
    const node = innerRef.current;
    if (!node) return;
    node.style.height = 'auto';
    const style = getComputedStyle(node);
    const lineHeight = Number.parseFloat(style.lineHeight) || 20;
    const paddingY =
      (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
    const borderY =
      (Number.parseFloat(style.borderTopWidth) || 0) +
      (Number.parseFloat(style.borderBottomWidth) || 0);
    const limit = lineHeight * maxRows + paddingY;
    node.style.height = `${Math.min(node.scrollHeight, limit) + borderY}px`;
  }, [maxRows]);

  React.useLayoutEffect(() => {
    resize();
  }, [text, resize]);

  React.useEffect(() => {
    const node = innerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    let width = node.clientWidth;
    const observer = new ResizeObserver(() => {
      if (node.clientWidth === width) return;
      width = node.clientWidth;
      resize();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [resize]);

  const shouldSubmitOnEnter = () => {
    if (submitOnEnter !== undefined) return submitOnEnter;
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return !window.matchMedia('(pointer: coarse)').matches;
  };

  return (
    <textarea
      ref={innerRef}
      id={`${id}-textarea`}
      rows={minRows}
      value={text}
      aria-label={label}
      enterKeyHint={submitOnEnter ? 'send' : undefined}
      disabled={disabled ?? (rootDisabled || undefined)}
      onChange={(event) => setText(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key !== 'Enter' || event.shiftKey) return;
        if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
        if (!shouldSubmitOnEnter()) return;
        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
      }}
      className={cn(
        'text-foreground placeholder:text-muted-foreground w-full resize-none bg-transparent px-3 py-3 text-base leading-relaxed outline-none md:text-sm',
        className,
      )}
      {...props}
    />
  );
};

PromptInputTextarea.displayName = 'PromptInputTextarea';

const PromptInputButton = ({
  className,
  label,
  variant = 'ghost',
  children,
  ref,
  ...props
}: PromptInputButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-2 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-4 [&>svg]:shrink-0',
        variant === 'ghost' && 'hover:bg-muted',
        variant === 'outline' && 'border-border hover:bg-muted border',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

PromptInputButton.displayName = 'PromptInputButton';

const PromptInputAddAttachments = ({
  className,
  label = 'Add files',
  children,
  onClick,
  ref,
  ...props
}: PromptInputAddAttachmentsProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { openFileDialog } = usePromptInput();

  return (
    <PromptInputButton
      ref={ref}
      label={label}
      className={className}
      onClick={(event) => {
        openFileDialog();
        onClick?.(event);
      }}
      {...props}
    >
      {children ?? <PaperclipIcon />}
    </PromptInputButton>
  );
};

PromptInputAddAttachments.displayName = 'PromptInputAddAttachments';

const PromptInputSubmit = ({
  className,
  status: statusProp,
  label,
  stopLabel,
  onStop,
  children,
  disabled,
  onClick,
  ref,
  ...props
}: PromptInputSubmitProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const {
    text,
    files,
    status: rootStatus,
    disabled: rootDisabled,
    reportSubmitStatus,
  } = usePromptInput();
  const status = statusProp ?? rootStatus ?? 'ready';
  const empty = text.trim().length === 0 && files.length === 0;
  const busy = status === 'streaming' || status === 'submitted';
  const name = busy ? (stopLabel ?? label ?? 'Stop generating') : (label ?? 'Send message');

  React.useEffect(() => {
    reportSubmitStatus(statusProp);
    return () => reportSubmitStatus(undefined);
  }, [statusProp, reportSubmitStatus]);

  const icon = () => {
    if (status === 'streaming') return <SquareIcon />;
    if (status === 'error') return <AlertIcon />;
    if (status === 'submitted') return <LoaderIcon className="motion-safe:animate-spin" />;
    return <SendIcon />;
  };

  const defaultDisabled = busy
    ? !onStop && !onClick
    : rootDisabled || (status === 'ready' && empty);

  return (
    <button
      ref={ref}
      type={busy ? 'button' : 'submit'}
      aria-label={name}
      title={name}
      data-status={status}
      disabled={disabled ?? defaultDisabled}
      onClick={(event) => {
        onClick?.(event);
        if (busy && !event.defaultPrevented) onStop?.();
      }}
      className={cn(
        'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-4 [&>svg]:shrink-0',
        status === 'error' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        className,
      )}
      {...props}
    >
      {children ?? icon()}
    </button>
  );
};

PromptInputSubmit.displayName = 'PromptInputSubmit';

const PromptInput = Object.assign(PromptInputRoot, {
  Header: PromptInputHeader,
  Body: PromptInputBody,
  Footer: PromptInputFooter,
  Tools: PromptInputTools,
  Attachments: PromptInputAttachments,
  Textarea: PromptInputTextarea,
  Button: PromptInputButton,
  AddAttachments: PromptInputAddAttachments,
  Submit: PromptInputSubmit,
});

export { PromptInput, usePromptInput, usePromptInputAttachments };
export type {
  PromptInputAddAttachmentsProps,
  PromptInputAttachmentsProps,
  PromptInputBodyProps,
  PromptInputButtonProps,
  PromptInputError,
  PromptInputErrorCode,
  PromptInputFile,
  PromptInputFooterProps,
  PromptInputHeaderProps,
  PromptInputMessage,
  PromptInputProps,
  PromptInputStatus,
  PromptInputSubmitProps,
  PromptInputTextareaProps,
  PromptInputToolsProps,
};
