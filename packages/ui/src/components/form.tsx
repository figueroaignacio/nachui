'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '../lib/cn';
import { assignRef } from '../lib/overlay';
import { Button, type ButtonProps } from './button';
import { Field, type FieldProps, useFieldContext } from './field';

type FormErrors = Record<string, string[]>;
type FormErrorsInput = Record<string, string | readonly string[] | null | undefined>;
type FormValues = Record<string, FormDataEntryValue | FormDataEntryValue[]>;
type FormValidationMode = 'onSubmit' | 'onBlur' | 'onChange';

interface FormSchemaIssue {
  path: readonly PropertyKey[];
  message: string;
}

type FormSchemaResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: readonly FormSchemaIssue[] } };

interface FormSchema<T> {
  safeParse: (data: unknown) => FormSchemaResult<T>;
}

interface FormContextValue {
  errors: FormErrors;
  submitted: boolean;
  submitting: boolean;
  getErrors: (name: string) => string[];
  focusField: (name: string) => void;
  validate: () => boolean;
}

interface FormInternalValue extends FormContextValue {
  showSummary: boolean;
  summary: Array<{ name: string; message: string; id: string | undefined }>;
  register: (name: string, controlId: string) => () => void;
}

const FormContext = React.createContext<FormInternalValue | null>(null);

function useFormInternal(): FormInternalValue {
  const context = React.use(FormContext);
  if (!context) throw new Error('Form components must be used within Form');
  return context;
}

function useFormContext(): FormContextValue {
  const { errors, submitted, submitting, getErrors, focusField, validate } = useFormInternal();
  return { errors, submitted, submitting, getErrors, focusField, validate };
}

function useFormField(name: string) {
  const { getErrors } = useFormInternal();
  const errors = getErrors(name);
  return { name, errors, invalid: errors.length > 0 };
}

const EMPTY: string[] = [];

function normalizeErrors(input: FormErrorsInput | null | undefined): FormErrors {
  const result: FormErrors = {};
  if (!input) return result;
  for (const [name, value] of Object.entries(input)) {
    const messages = (typeof value === 'string' ? [value] : (value ?? [])).filter(Boolean);
    if (messages.length > 0) result[name] = [...messages];
  }
  return result;
}

function mergeErrors(...sources: FormErrors[]): FormErrors {
  const result: FormErrors = {};
  for (const source of sources) {
    for (const [name, messages] of Object.entries(source)) {
      result[name] = [...new Set([...(result[name] ?? []), ...messages])];
    }
  }
  return result;
}

function readValues(form: HTMLFormElement): FormValues {
  const values: FormValues = {};
  for (const [key, value] of new FormData(form)) {
    const current = values[key];
    if (current === undefined) values[key] = value;
    else values[key] = Array.isArray(current) ? [...current, value] : [current, value];
  }
  return values;
}

type ValidatableElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isValidatable(element: Element): element is ValidatableElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  );
}

function fallbackMessage(element: ValidatableElement) {
  const validity = element.validity;
  if (validity.valueMissing) return 'This field is required.';
  if (validity.typeMismatch) return 'Enter a valid value.';
  if (validity.tooShort) return `Use at least ${element.getAttribute('minlength')} characters.`;
  if (validity.tooLong) return `Use at most ${element.getAttribute('maxlength')} characters.`;
  return 'Check this value.';
}

function nativeErrors(form: HTMLFormElement): FormErrors {
  const errors: FormErrors = {};
  for (const element of Array.from(form.elements)) {
    if (!isValidatable(element) || !element.name || !element.willValidate) continue;
    if (element.validity.valid || errors[element.name]) continue;
    errors[element.name] = [element.validationMessage || fallbackMessage(element)];
  }
  return errors;
}

function schemaErrors<T>(schema: FormSchema<T>, values: FormValues) {
  const result = schema.safeParse(values);
  if (result.success) return { errors: {} as FormErrors, data: result.data };
  const errors: FormErrors = {};
  for (const issue of result.error.issues) {
    const name = issue.path.map(String).join('.');
    errors[name] = [...new Set([...(errors[name] ?? []), issue.message])];
  }
  return { errors, data: undefined };
}

function fieldNameOf(target: EventTarget | null) {
  if (!(target instanceof Element)) return undefined;
  if (isValidatable(target) && target.name) return target.name;
  return target.closest<HTMLElement>('[data-slot="field"][data-name]')?.dataset.name;
}

function hasEntries(errors: FormErrors) {
  return Object.keys(errors).length > 0;
}

interface FormProps<T = FormValues> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'action'
> {
  schema?: FormSchema<T>;
  action?: string | ((formData: FormData) => void | Promise<void>);
  errors?: FormErrorsInput | null;
  onSubmit?: (data: T, event: React.FormEvent<HTMLFormElement>) => void | Promise<unknown>;
  validationMode?: FormValidationMode;
  ref?: React.Ref<HTMLFormElement>;
}

function FormRoot<T = FormValues>({
  schema,
  action,
  errors: serverErrorsProp,
  onSubmit,
  validationMode = 'onSubmit',
  onReset,
  onBlur,
  onChange,
  className,
  children,
  ref,
  ...props
}: FormProps<T>) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [clientErrors, setClientErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [controls, setControls] = React.useState<ReadonlyMap<string, string>>(() => new Map());
  const [dismissed, setDismissed] = React.useState<{
    source: FormErrorsInput | null | undefined;
    names: ReadonlySet<string> | 'all';
  }>({ source: undefined, names: new Set() });
  const committedServerRef = React.useRef(serverErrorsProp);
  const focusRequestRef = React.useRef(false);
  const pointerDownRef = React.useRef(false);
  const resetCountRef = React.useRef(0);

  const serverErrors = React.useMemo(() => {
    const normalized = normalizeErrors(serverErrorsProp);
    if (dismissed.source !== serverErrorsProp) return normalized;
    if (dismissed.names === 'all') return {};
    const names = dismissed.names;
    return Object.fromEntries(Object.entries(normalized).filter(([name]) => !names.has(name)));
  }, [serverErrorsProp, dismissed]);

  const errors = React.useMemo(
    () => mergeErrors(clientErrors, serverErrors),
    [clientErrors, serverErrors],
  );

  const setRefs = React.useCallback(
    (node: HTMLFormElement | null) => {
      formRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const register = React.useCallback((name: string, controlId: string) => {
    setControls((previous) => {
      if (previous.get(name) === controlId) return previous;
      const next = new Map(previous);
      next.set(name, controlId);
      return next;
    });
    return () => {
      setControls((previous) => {
        if (previous.get(name) !== controlId) return previous;
        const next = new Map(previous);
        next.delete(name);
        return next;
      });
    };
  }, []);

  const elementFor = React.useCallback(
    (name: string): HTMLElement | null => {
      const form = formRef.current;
      if (!form) return null;
      const id = controls.get(name);
      const byId = id ? form.ownerDocument.getElementById(id) : null;
      if (byId) return byId;
      const named = Array.from(form.elements).filter(
        (element): element is ValidatableElement => isValidatable(element) && element.name === name,
      );
      return named.find((element) => element.type !== 'hidden') ?? null;
    },
    [controls],
  );

  const focusField = React.useCallback(
    (name: string) => {
      const element = elementFor(name);
      if (!element) return;
      element.focus();
      element.scrollIntoView?.({ block: 'center' });
    },
    [elementFor],
  );

  const focusFirstInvalid = React.useCallback(
    (names: string[]) => {
      const elements = names
        .map((name) => elementFor(name))
        .filter((element): element is HTMLElement => element !== null);
      elements.sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      const first = elements[0];
      if (!first) return;
      first.focus();
      first.scrollIntoView?.({ block: 'center' });
    },
    [elementFor],
  );

  const collect = React.useCallback(() => {
    const form = formRef.current;
    if (!form) return { errors: {} as FormErrors, data: undefined as T | undefined };
    const values = readValues(form);
    const native = nativeErrors(form);
    if (!schema) return { errors: native, data: values as T };
    const fromSchema = schemaErrors(schema, values);
    return { errors: { ...native, ...fromSchema.errors }, data: fromSchema.data };
  }, [schema]);

  const revalidate = React.useCallback(
    (name: string) => {
      const next = collect().errors[name];
      setClientErrors((previous) => {
        if (!next && !previous[name]) return previous;
        const updated = { ...previous };
        if (next) updated[name] = next;
        else delete updated[name];
        return updated;
      });
    },
    [collect],
  );

  const validate = React.useCallback(() => {
    const result = collect();
    setClientErrors(result.errors);
    return !hasEntries(result.errors);
  }, [collect]);

  const dismissServer = React.useCallback((names: string[] | 'all') => {
    setDismissed((previous) => {
      const source = committedServerRef.current;
      if (names === 'all') return { source, names: 'all' };
      const kept = previous.source === source ? previous.names : new Set<string>();
      if (kept === 'all') return previous;
      if (names.every((name) => kept.has(name))) return previous;
      return { source, names: new Set([...kept, ...names]) };
    });
  }, []);

  React.useLayoutEffect(() => {
    committedServerRef.current = serverErrorsProp;
  }, [serverErrorsProp]);

  React.useEffect(() => {
    if (!focusRequestRef.current) return;
    focusRequestRef.current = false;
    focusFirstInvalid(Object.keys(clientErrors));
  }, [clientErrors, focusFirstInvalid]);

  const focusFirstInvalidRef = React.useRef(focusFirstInvalid);

  React.useLayoutEffect(() => {
    focusFirstInvalidRef.current = focusFirstInvalid;
  }, [focusFirstInvalid]);

  React.useEffect(() => {
    const names = Object.keys(normalizeErrors(serverErrorsProp));
    if (names.length > 0) focusFirstInvalidRef.current(names);
  }, [serverErrorsProp]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const result = collect();
    if (hasEntries(result.errors)) {
      event.preventDefault();
      focusRequestRef.current = true;
      setClientErrors(result.errors);
      setSubmitted(true);
      return;
    }
    setClientErrors({});
    setSubmitted(false);
    dismissServer('all');
    if (!onSubmit) return;
    if (action === undefined) event.preventDefault();
    const outcome = onSubmit(result.data as T, event);
    if (outcome && typeof (outcome as Promise<unknown>).then === 'function') {
      setSubmitting(true);
      Promise.resolve(outcome).finally(() => setSubmitting(false));
    }
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    onReset?.(event);
    resetCountRef.current += 1;
    setClientErrors({});
    setSubmitted(false);
    dismissServer('all');
  };

  React.useEffect(() => {
    const doc = formRef.current?.ownerDocument ?? document;
    const down = () => {
      pointerDownRef.current = true;
    };
    const up = () => {
      pointerDownRef.current = false;
    };
    doc.addEventListener('pointerdown', down, true);
    doc.addEventListener('pointerup', up, true);
    doc.addEventListener('pointercancel', up, true);
    return () => {
      doc.removeEventListener('pointerdown', down, true);
      doc.removeEventListener('pointerup', up, true);
      doc.removeEventListener('pointercancel', up, true);
    };
  }, []);

  const revalidateAfterPointer = (name: string) => {
    const doc = formRef.current?.ownerDocument;
    if (!doc || !pointerDownRef.current) {
      revalidate(name);
      return;
    }
    const resets = resetCountRef.current;
    const release = () => {
      doc.removeEventListener('pointerup', release, true);
      doc.removeEventListener('pointercancel', release, true);
      setTimeout(() => {
        if (resetCountRef.current === resets) revalidate(name);
      }, 0);
    };
    doc.addEventListener('pointerup', release, true);
    doc.addEventListener('pointercancel', release, true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    onBlur?.(event);
    if (validationMode === 'onSubmit' && !submitted) return;
    const name = fieldNameOf(event.target);
    if (name) revalidateAfterPointer(name);
  };

  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    onChange?.(event);
    const name = fieldNameOf(event.target);
    if (!name) return;
    if (serverErrors[name]) dismissServer([name]);
    const target = event.target as EventTarget as HTMLInputElement;
    const discrete =
      target instanceof HTMLSelectElement || target.type === 'checkbox' || target.type === 'radio';
    if (validationMode === 'onChange' || (discrete && (submitted || validationMode === 'onBlur'))) {
      revalidate(name);
    }
  };

  const getErrors = React.useCallback((name: string) => errors[name] ?? EMPTY, [errors]);

  const summary = React.useMemo(() => {
    const order = [...controls.keys()];
    const names = Object.keys(errors).sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    });
    return names.map((name) => ({
      name,
      message: errors[name]?.[0] ?? '',
      id: controls.get(name),
    }));
  }, [errors, controls]);

  const showSummary = (submitted || hasEntries(serverErrors)) && hasEntries(errors);

  const context = React.useMemo<FormInternalValue>(
    () => ({
      errors,
      submitted,
      submitting,
      getErrors,
      focusField,
      validate,
      showSummary,
      summary,
      register,
    }),
    [
      errors,
      submitted,
      submitting,
      getErrors,
      focusField,
      validate,
      showSummary,
      summary,
      register,
    ],
  );

  return (
    <FormContext value={context}>
      <form
        ref={setRefs}
        noValidate
        action={action}
        data-slot="form"
        data-submitted={submitted ? '' : undefined}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onBlur={handleBlur}
        onChange={handleChange}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        {children}
      </form>
    </FormContext>
  );
}

function FormRegistration({ name }: { name: string }) {
  const field = useFieldContext();
  const { register } = useFormInternal();
  const controlId = field?.controlId;

  React.useEffect(() => {
    if (!controlId) return;
    return register(name, controlId);
  }, [name, controlId, register]);

  return null;
}

type ElementWithProps = React.ReactElement<
  Record<string, unknown> & { children?: React.ReactNode }
>;

function hasNamedElement(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const props = (child as ElementWithProps).props;
    return typeof props.name === 'string' || hasNamedElement(props.children);
  });
}

interface ConnectOptions {
  name: string;
  errors: string[];
  nameControl: boolean;
  controlId: string;
}

function connectChildren(children: React.ReactNode, options: ConnectOptions): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as ElementWithProps;
    if (element.type === Field.Error) {
      return element.props.errors === undefined
        ? React.cloneElement(element, { errors: options.errors })
        : element;
    }
    if (element.type === Field.Control) {
      const control = element.props.children;
      if (!React.isValidElement(control)) return element;
      const controlProps = (control as ElementWithProps).props;
      const injected: Record<string, unknown> = {};
      if (controlProps.id === undefined) injected.id = options.controlId;
      if (options.nameControl) injected.name = options.name;
      return React.cloneElement(element, {
        children: React.cloneElement(control as ElementWithProps, injected),
      });
    }
    if (element.props.children === undefined) return element;
    return React.cloneElement(element, {
      children: connectChildren(element.props.children, options),
    });
  });
}

interface FormFieldProps extends FieldProps {
  name: string;
}

const FormField = ({
  name,
  id,
  invalid,
  children,
  ref,
  ...props
}: FormFieldProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { errors } = useFormField(name);
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const connected = connectChildren(children, {
    name,
    errors,
    nameControl: !hasNamedElement(children),
    controlId: `${fieldId}-control`,
  });

  return (
    <Field ref={ref} id={fieldId} name={name} invalid={invalid || errors.length > 0} {...props}>
      <FormRegistration name={name} />
      {connected}
    </Field>
  );
};
FormField.displayName = 'FormField';

interface FormErrorSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
}

const FormErrorSummary = ({
  title = 'Check these fields',
  className,
  ref,
  ...props
}: FormErrorSummaryProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { showSummary, summary, focusField } = useFormInternal();
  const titleId = React.useId();
  if (!showSummary || summary.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      aria-labelledby={titleId}
      data-slot="form-error-summary"
      className={cn(
        'border-destructive-border bg-destructive-surface text-destructive-text rounded-md border p-4 text-sm',
        className,
      )}
      {...props}
    >
      <p id={titleId} className="font-medium">
        {title}
      </p>
      <ul className="ms-4 mt-2 flex list-disc flex-col gap-1">
        {summary.map((item) =>
          item.name ? (
            <li key={item.name}>
              <a
                href={item.id ? `#${item.id}` : '#'}
                data-slot="form-error-summary-link"
                onClick={(event) => {
                  event.preventDefault();
                  focusField(item.name);
                }}
                className="focus-visible:ring-ring ring-offset-background rounded-sm underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {item.message}
              </a>
            </li>
          ) : (
            <li key="form">{item.message}</li>
          ),
        )}
      </ul>
    </div>
  );
};
FormErrorSummary.displayName = 'FormErrorSummary';

const FormSubmit = ({ loading, ...props }: ButtonProps) => {
  const { pending } = useFormStatus();
  const { submitting } = useFormInternal();

  return (
    <Button
      type="submit"
      data-slot="form-submit"
      loading={pending || submitting || loading}
      {...props}
    />
  );
};
FormSubmit.displayName = 'FormSubmit';

const Form = Object.assign(FormRoot, {
  Field: FormField,
  ErrorSummary: FormErrorSummary,
  Submit: FormSubmit,
});

export { Form, useFormContext, useFormField };
export type {
  FormContextValue,
  FormErrors,
  FormErrorsInput,
  FormErrorSummaryProps,
  FormFieldProps,
  FormProps,
  FormSchema,
  FormSchemaIssue,
  FormSchemaResult,
  FormValidationMode,
  FormValues,
};
