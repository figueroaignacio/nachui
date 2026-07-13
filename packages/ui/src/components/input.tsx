import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';
import { Label } from './label';

const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 focus-visible:border-foreground/40 focus-visible:ring-foreground/10 focus-visible:ring-[1px] aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/30 aria-invalid:border-destructive',
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 py-1 text-xs file:text-xs file:h-6',
        default: 'h-9 px-3 py-1 text-base md:text-sm file:text-sm file:h-7',
        lg: 'h-10 px-4 py-2 text-base file:text-base file:h-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

type InputSize = VariantProps<typeof inputVariants>['size'];

interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  label?: string;
  error?: string;
  description?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputWrapper = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
);
InputWrapper.displayName = 'InputWrapper';

const InputDescription = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }) => (
  <span ref={ref} className={cn('text-muted-foreground text-xs', className)} {...props} />
);
InputDescription.displayName = 'InputDescription';

const InputError = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }) => (
  <span ref={ref} className={cn('text-destructive text-xs', className)} {...props} />
);
InputError.displayName = 'InputError';

const InputRoot = ({
  className,
  type,
  label,
  error,
  description,
  size,
  leftIcon,
  rightIcon,
  id,
  ref,
  ...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  const describedBy =
    [description ? descriptionId : undefined, error ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <InputWrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {description && <InputDescription id={descriptionId}>{description}</InputDescription>}
      <div className="relative">
        {leftIcon && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          data-slot="input"
          className={cn(
            inputVariants({ size }),
            error && 'border-destructive focus-visible:border-destructive',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
        {rightIcon && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <InputError id={errorId}>{error}</InputError>}
    </InputWrapper>
  );
};

InputRoot.displayName = 'Input';

const Input = Object.assign(InputRoot, {
  Wrapper: InputWrapper,
  Label: Label,
  Description: InputDescription,
  Error: InputError,
});

export { Input, inputVariants };
export type { InputProps };
