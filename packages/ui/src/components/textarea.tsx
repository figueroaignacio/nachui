'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';
import { Label } from './label';

const textareaVariants = cva(
  'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-foreground/40 focus-visible:ring-foreground/10 aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/30 aria-invalid:border-destructive flex w-full min-w-0 rounded-md border bg-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[1px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      size: {
        sm: 'min-h-14 px-2.5 py-1.5 text-xs',
        default: 'min-h-16 px-3 py-2 text-base md:text-sm',
        lg: 'min-h-20 px-4 py-2.5 text-base',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        both: 'resize',
      },
    },
    defaultVariants: {
      size: 'default',
      resize: 'vertical',
    },
  },
);

type TextareaSize = VariantProps<typeof textareaVariants>['size'];
type TextareaResize = VariantProps<typeof textareaVariants>['resize'];

interface TextareaProps extends Omit<React.ComponentProps<'textarea'>, 'size'> {
  label?: string;
  error?: string;
  description?: string;
  size?: TextareaSize;
  resize?: TextareaResize;
  autoResize?: boolean;
  maxRows?: number;
  showCount?: boolean;
}

const TextareaWrapper = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
);
TextareaWrapper.displayName = 'TextareaWrapper';

const TextareaDescription = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }) => (
  <span ref={ref} className={cn('text-muted-foreground text-xs', className)} {...props} />
);
TextareaDescription.displayName = 'TextareaDescription';

const TextareaError = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }) => (
  <span
    ref={ref}
    aria-live="polite"
    className={cn('text-destructive text-xs', className)}
    {...props}
  />
);
TextareaError.displayName = 'TextareaError';

const TextareaCount = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }) => (
  <span
    ref={ref}
    aria-live="polite"
    className={cn('text-muted-foreground ml-auto text-xs tabular-nums', className)}
    {...props}
  />
);
TextareaCount.displayName = 'TextareaCount';

function valueLength(value: unknown): number {
  if (typeof value === 'string') return value.length;
  if (typeof value === 'number') return String(value).length;
  return 0;
}

const TextareaRoot = ({
  className,
  label,
  error,
  description,
  size,
  resize,
  autoResize = false,
  maxRows,
  showCount = false,
  maxLength,
  id,
  ref,
  rows,
  value,
  defaultValue,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) => {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const descriptionId = `${textareaId}-description`;
  const countId = `${textareaId}-count`;

  const innerRef = React.useRef<HTMLTextAreaElement>(null);
  const [uncontrolledLength, setUncontrolledLength] = React.useState(() =>
    valueLength(defaultValue),
  );
  const length = value !== undefined ? valueLength(value) : uncontrolledLength;

  const mergedRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    },
    [ref],
  );

  const fitToContent = React.useCallback(() => {
    const node = innerRef.current;
    if (!node || !autoResize) return;

    const styles = window.getComputedStyle(node);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 20;
    const padding =
      (Number.parseFloat(styles.paddingTop) || 0) + (Number.parseFloat(styles.paddingBottom) || 0);
    const border =
      (Number.parseFloat(styles.borderTopWidth) || 0) +
      (Number.parseFloat(styles.borderBottomWidth) || 0);
    const limit = maxRows ? maxRows * lineHeight + padding + border : Number.POSITIVE_INFINITY;

    node.style.height = 'auto';
    const next = node.scrollHeight + border;
    node.style.height = `${Math.min(next, limit)}px`;
    node.style.overflowY = next > limit ? 'auto' : 'hidden';
  }, [autoResize, maxRows]);

  React.useEffect(() => {
    fitToContent();
  }, [fitToContent, value]);

  const describedBy =
    [
      description ? descriptionId : undefined,
      error ? errorId : undefined,
      showCount ? countId : undefined,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <TextareaWrapper>
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      {description && <TextareaDescription id={descriptionId}>{description}</TextareaDescription>}
      <textarea
        ref={mergedRef}
        id={textareaId}
        data-slot="textarea"
        rows={rows ?? (autoResize ? 1 : undefined)}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          textareaVariants({ size, resize: autoResize ? 'none' : resize }),
          error && 'border-destructive focus-visible:border-destructive',
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        onChange={(event) => {
          onChange?.(event);
          if (value === undefined) setUncontrolledLength(event.target.value.length);
          fitToContent();
        }}
        {...props}
      />
      {(error || showCount) && (
        <div className="flex items-start gap-3">
          {error && <TextareaError id={errorId}>{error}</TextareaError>}
          {showCount && (
            <TextareaCount id={countId}>
              {maxLength ? `${length} / ${maxLength}` : length}
            </TextareaCount>
          )}
        </div>
      )}
    </TextareaWrapper>
  );
};

TextareaRoot.displayName = 'Textarea';

const Textarea = Object.assign(TextareaRoot, {
  Wrapper: TextareaWrapper,
  Label: Label,
  Description: TextareaDescription,
  Error: TextareaError,
  Count: TextareaCount,
});

export { Textarea, textareaVariants };
export type { TextareaProps };
