'use client';

import * as React from 'react';
import { cn } from '../lib/cn';
import { Label } from './label';

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

interface FieldContextValue {
  id: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  disabled: boolean;
  hasDescription: boolean;
  hasError: boolean;
  setHasDescription: (present: boolean) => void;
  setHasError: (present: boolean) => void;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFieldContext(): FieldContextValue | null {
  return React.use(FieldContext);
}

interface FieldControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean | undefined;
  disabled: boolean | undefined;
}

function useField(): FieldControlProps {
  const field = React.use(FieldContext);
  if (!field) throw new Error('useField must be used within Field');

  const describedBy =
    [
      field.hasDescription ? field.descriptionId : undefined,
      field.hasError ? field.errorId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return {
    id: field.id,
    'aria-describedby': describedBy,
    'aria-invalid': field.invalid || undefined,
    disabled: field.disabled || undefined,
  };
}

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: FieldOrientation;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
}

const FieldRoot = ({
  orientation = 'vertical',
  invalid = false,
  disabled = false,
  name,
  id,
  className,
  ref,
  ...props
}: FieldProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const [hasDescription, setHasDescription] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const context = React.useMemo(
    () => ({
      id: fieldId,
      descriptionId: `${fieldId}-description`,
      errorId: `${fieldId}-error`,
      invalid,
      disabled,
      hasDescription,
      hasError,
      setHasDescription,
      setHasError,
    }),
    [fieldId, invalid, disabled, hasDescription, hasError],
  );

  return (
    <FieldContext value={context}>
      <div
        ref={ref}
        role="group"
        data-slot="field"
        data-name={name}
        data-orientation={orientation}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'group/field data-[invalid]:text-destructive flex w-full gap-2 data-[disabled]:opacity-60',
          orientation === 'vertical' && 'flex-col [&>*]:w-full',
          orientation === 'horizontal' &&
            'flex-row items-center [&>[data-slot=field-content]]:flex-1 [&>[data-slot=field-label]]:flex-auto',
          orientation === 'responsive' &&
            'flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto @md/field-group:[&>[data-slot=field-content]]:flex-1 @md/field-group:[&>[data-slot=field-label]]:flex-auto',
          className,
        )}
        {...props}
      />
    </FieldContext>
  );
};
FieldRoot.displayName = 'Field';

interface FieldControlSlotProps {
  children: React.ReactElement<Record<string, unknown>>;
}

const FieldControl = ({ children }: FieldControlSlotProps) => {
  const control = useField();
  const childProps = children.props;
  const describedBy =
    [control['aria-describedby'], childProps['aria-describedby'] as string | undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  const injected: Record<string, unknown> = { id: childProps.id ?? control.id };
  if (describedBy) injected['aria-describedby'] = describedBy;
  if (childProps['aria-invalid'] === undefined && control['aria-invalid']) {
    injected['aria-invalid'] = true;
  }
  if (childProps.disabled === undefined && control.disabled) injected.disabled = true;

  return React.cloneElement(children, injected);
};
FieldControl.displayName = 'FieldControl';

type FieldLabelProps = React.ComponentProps<typeof Label>;

const FieldLabel = ({ className, htmlFor, ...props }: FieldLabelProps) => {
  const field = useFieldContext();

  return (
    <Label
      data-slot="field-label"
      htmlFor={htmlFor ?? field?.id}
      className={cn(
        'group-data-[invalid]/field:text-destructive group-data-[disabled]/field:opacity-70',
        className,
      )}
      {...props}
    />
  );
};
FieldLabel.displayName = 'FieldLabel';

const FieldDescription = ({
  className,
  id,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const field = useFieldContext();
  const setHasDescription = field?.setHasDescription;

  React.useEffect(() => {
    setHasDescription?.(true);
    return () => setHasDescription?.(false);
  }, [setHasDescription]);

  return (
    <p
      ref={ref}
      id={id ?? field?.descriptionId}
      data-slot="field-description"
      className={cn(
        'text-muted-foreground [&>a:hover]:text-foreground text-sm leading-normal font-normal [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      {...props}
    />
  );
};
FieldDescription.displayName = 'FieldDescription';

type FieldErrorMessage = string | { message?: string } | undefined | null;

interface FieldErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  errors?: FieldErrorMessage[];
}

function errorMessages(errors: FieldErrorMessage[] | undefined): string[] {
  if (!errors) return [];
  const messages = errors
    .map((error) => (typeof error === 'string' ? error : error?.message))
    .filter((message): message is string => Boolean(message));
  return [...new Set(messages)];
}

const FieldError = ({
  errors,
  children,
  className,
  id,
  ref,
  ...props
}: FieldErrorProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const field = useFieldContext();
  const messages = errorMessages(errors);
  const hasContent = Boolean(children) || messages.length > 0;
  const setHasError = field?.setHasError;

  React.useEffect(() => {
    setHasError?.(hasContent);
    return () => setHasError?.(false);
  }, [setHasError, hasContent]);

  if (!hasContent) return null;

  let content: React.ReactNode = children;
  if (!content && messages.length === 1) content = messages[0];
  if (!content && messages.length > 1) {
    content = (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={ref}
      id={id ?? field?.errorId}
      role="alert"
      data-slot="field-error"
      className={cn('text-destructive text-sm font-normal', className)}
      {...props}
    >
      {content}
    </div>
  );
};
FieldError.displayName = 'FieldError';

const FieldContent = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    data-slot="field-content"
    className={cn('group/field-content flex flex-1 flex-col gap-1 leading-snug', className)}
    {...props}
  />
);
FieldContent.displayName = 'FieldContent';

const FieldTitle = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    data-slot="field-title"
    className={cn(
      'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled]/field:opacity-70',
      className,
    )}
    {...props}
  />
);
FieldTitle.displayName = 'FieldTitle';

const FieldSet = ({
  className,
  ref,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  ref?: React.Ref<HTMLFieldSetElement>;
}) => (
  <fieldset
    ref={ref}
    data-slot="field-set"
    className={cn(
      'flex min-w-0 flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
      className,
    )}
    {...props}
  />
);
FieldSet.displayName = 'FieldSet';

interface FieldLegendProps extends React.HTMLAttributes<HTMLLegendElement> {
  variant?: 'legend' | 'label';
}

const FieldLegend = ({
  variant = 'legend',
  className,
  ref,
  ...props
}: FieldLegendProps & { ref?: React.Ref<HTMLLegendElement> }) => (
  <legend
    ref={ref}
    data-slot="field-legend"
    data-variant={variant}
    className={cn('mb-3 font-medium', variant === 'legend' ? 'text-base' : 'text-sm', className)}
    {...props}
  />
);
FieldLegend.displayName = 'FieldLegend';

const FieldGroup = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    data-slot="field-group"
    className={cn(
      'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
      className,
    )}
    {...props}
  />
);
FieldGroup.displayName = 'FieldGroup';

const FieldSeparator = ({
  children,
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    data-slot="field-separator"
    data-content={children ? '' : undefined}
    className={cn('relative -my-2 h-5 text-sm', className)}
    {...props}
  >
    <div aria-hidden="true" className="bg-border absolute inset-x-0 top-1/2 h-px" />
    {children && (
      <span className="bg-background text-muted-foreground relative mx-auto block w-fit px-2">
        {children}
      </span>
    )}
  </div>
);
FieldSeparator.displayName = 'FieldSeparator';

const Field = Object.assign(FieldRoot, {
  Control: FieldControl,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Content: FieldContent,
  Title: FieldTitle,
  Set: FieldSet,
  Legend: FieldLegend,
  Group: FieldGroup,
  Separator: FieldSeparator,
});

export { Field, useField, useFieldContext };
export type {
  FieldProps,
  FieldOrientation,
  FieldErrorProps,
  FieldErrorMessage,
  FieldLegendProps,
  FieldControlProps,
};
