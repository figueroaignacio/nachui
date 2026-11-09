'use client';

import * as React from 'react';
import { flushSync } from 'react-dom';
import { cn } from '../lib/cn';
import { FormValue, useFormReset } from '../lib/form-control';
import { assignRef } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function PlusIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function MinusIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M5 12h14" />
    </svg>
  );
}

interface NumberFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'id'
> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  format?: Intl.NumberFormatOptions;
  locale?: string | string[];
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  allowWheel?: boolean;
  id?: string;
  ref?: React.Ref<HTMLDivElement>;
}

interface NumberFieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

interface NumberFieldInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'type' | 'min' | 'max' | 'step'
> {
  ref?: React.Ref<HTMLInputElement>;
}

interface NumberFieldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}

interface ForwardedAria {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

interface NumberFieldContextValue {
  inputId: string;
  setInputElement: (node: HTMLInputElement | null) => void;
  value: number | null;
  text: string;
  formatted: string | undefined;
  min?: number;
  max?: number;
  step: number;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  inputMode: 'numeric' | 'decimal';
  canIncrement: boolean;
  canDecrement: boolean;
  aria: ForwardedAria;
  setDraft: (draft: string) => void;
  commit: () => void;
  stepBy: (amount: number) => boolean;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const NumberFieldContext = React.createContext<NumberFieldContextValue | null>(null);

function useNumberFieldContext(): NumberFieldContextValue {
  const context = React.use(NumberFieldContext);
  if (!context) throw new Error('NumberField components must be used within NumberField');
  return context;
}

function decimalsOf(value: number) {
  if (!Number.isFinite(value)) return 0;
  const [, fraction = ''] = String(value).split('.');
  return fraction.length;
}

function createParser(locale: string | string[], format: Intl.NumberFormatOptions | undefined) {
  const parts = new Intl.NumberFormat(locale, {
    useGrouping: true,
    minimumFractionDigits: 1,
  }).formatToParts(-11111.1);
  const group = parts.find((part) => part.type === 'group')?.value ?? ',';
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const digitFormatter = new Intl.NumberFormat(locale, { useGrouping: false });
  const digits = new Map(
    Array.from({ length: 10 }, (_, digit) => [digitFormatter.format(digit), String(digit)]),
  );
  const percent = format?.style === 'percent';

  return (text: string): number | null => {
    let source = Array.from(text.trim())
      .map((character) => digits.get(character) ?? character)
      .join('');
    if (!source) return null;
    const negative = /^\(.*\)$/.test(source) || /[-−]/.test(source);
    source = source.split(group).join('').replace(/\s/g, '').split(decimal).join('.');
    const cleaned = source.replace(/[^0-9.]/g, '');
    if (!/^(\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number.NaN;
    let parsed = Number(cleaned);
    if (negative) parsed = -parsed;
    if (percent) parsed /= 100;
    return parsed;
  };
}

interface IntlEntry {
  formatter: Intl.NumberFormat;
  parse: (text: string) => number | null;
}

const intlCache = new Map<string, IntlEntry>();

function getIntl(locale: string | string[], format: Intl.NumberFormatOptions | undefined) {
  const key = `${String(locale)}|${JSON.stringify(format ?? {})}`;
  const cached = intlCache.get(key);
  if (cached) return cached;
  const entry = {
    formatter: new Intl.NumberFormat(locale, format),
    parse: createParser(locale, format),
  };
  intlCache.set(key, entry);
  return entry;
}

function NumberFieldRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  largeStep = 10,
  format,
  locale = 'en-US',
  name,
  form,
  required = false,
  disabled = false,
  readOnly = false,
  allowWheel = false,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  className,
  children,
  ref,
  ...props
}: NumberFieldProps) {
  const [value, setValue] = useControllableState<number | null>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const [draft, setDraft] = React.useState<string | null>(null);
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const valueRef = React.useRef(value);
  const initialRef = React.useRef(defaultValue ?? null);
  const { formatter, parse } = getIntl(locale, format);

  React.useLayoutEffect(() => {
    valueRef.current = value;
  });

  const update = (next: number | null) => {
    valueRef.current = next;
    setValue(next);
  };

  const normalize = (raw: number) => {
    const base = min ?? 0;
    let next = raw;
    if (step > 0) {
      next = base + Math.round((raw - base) / step) * step;
      next = Number(next.toFixed(Math.max(decimalsOf(step), decimalsOf(base))));
    }
    if (max !== undefined) next = Math.min(next, max);
    if (min !== undefined) next = Math.max(next, min);
    return next;
  };

  const readCurrent = () => {
    if (draft === null) return valueRef.current;
    const parsed = parse(draft);
    return parsed === null || Number.isNaN(parsed) ? valueRef.current : parsed;
  };

  const interactive = !disabled && !readOnly;

  const stepBy = (amount: number) => {
    if (!interactive) return false;
    const current = readCurrent();
    const next = current === null ? normalize(min ?? 0) : normalize(current + amount);
    setDraft(null);
    if (next === valueRef.current) return false;
    update(next);
    return true;
  };

  const setTo = (target: number) => {
    setDraft(null);
    if (target !== valueRef.current) update(target);
  };

  const commit = () => {
    if (draft === null) return;
    const parsed = parse(draft);
    setDraft(null);
    if (parsed === null) {
      if (valueRef.current !== null) update(null);
      return;
    }
    if (Number.isNaN(parsed)) return;
    const next = normalize(parsed);
    if (next !== valueRef.current) update(next);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      flushSync(commit);
      return;
    }
    if (!interactive) return;
    const amount = event.shiftKey ? largeStep : step;
    switch (event.key) {
      case 'ArrowUp':
        stepBy(amount);
        break;
      case 'ArrowDown':
        stepBy(-amount);
        break;
      case 'PageUp':
        stepBy(largeStep);
        break;
      case 'PageDown':
        stepBy(-largeStep);
        break;
      case 'Home':
        if (min === undefined) return;
        setTo(min);
        break;
      case 'End':
        if (max === undefined) return;
        setTo(max);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const stepRef = React.useRef(stepBy);
  React.useLayoutEffect(() => {
    stepRef.current = stepBy;
  });

  React.useEffect(() => {
    const input = inputRef.current;
    if (!allowWheel || !input) return;
    const handleWheel = (event: WheelEvent) => {
      if (input.ownerDocument.activeElement !== input || event.deltaY === 0) return;
      event.preventDefault();
      stepRef.current(event.deltaY < 0 ? step : -step);
    };
    input.addEventListener('wheel', handleWheel, { passive: false });
    return () => input.removeEventListener('wheel', handleWheel);
  }, [allowWheel, step]);

  useFormReset(
    rootRef,
    () => {
      setDraft(null);
      update(initialRef.current);
    },
    form,
  );

  const formatted = value === null ? undefined : formatter.format(value);
  const integerOnly = Number.isInteger(step) && (min ?? -1) >= 0 && format?.style !== 'percent';

  const context: NumberFieldContextValue = {
    inputId,
    setInputElement: (node) => {
      inputRef.current = node;
    },
    value,
    text: draft ?? formatted ?? '',
    formatted,
    min,
    max,
    step,
    disabled,
    readOnly,
    required,
    inputMode: integerOnly ? 'numeric' : 'decimal',
    canIncrement: interactive && (value === null || max === undefined || value < max),
    canDecrement: interactive && (value === null || min === undefined || value > min),
    aria: {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
    },
    setDraft,
    commit,
    stepBy,
    onInputKeyDown,
  };

  const setRootRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    assignRef(ref, node);
  };

  return (
    <NumberFieldContext value={context}>
      <div
        ref={setRootRef}
        data-slot="number-field"
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        className={cn('relative flex flex-col gap-1.5', className)}
        {...props}
      >
        {children}
        <FormValue
          name={name}
          value={value === null ? '' : String(value)}
          form={form}
          disabled={disabled}
        />
      </div>
    </NumberFieldContext>
  );
}
NumberFieldRoot.displayName = 'NumberField';

function NumberFieldGroup({ className, ref, ...props }: NumberFieldGroupProps) {
  const { disabled } = useNumberFieldContext();

  return (
    <div
      ref={ref}
      data-slot="number-field-group"
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'border-input text-foreground dark:bg-input/30 flex h-9 w-full items-stretch overflow-hidden rounded-md border bg-transparent transition-[color,box-shadow]',
        'hover:border-border-interactive focus-within:border-ring focus-within:ring-ring focus-within:ring-[1px]',
        'has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive',
        'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
        className,
      )}
      {...props}
    />
  );
}
NumberFieldGroup.displayName = 'NumberFieldGroup';

function NumberFieldInput({
  className,
  onChange,
  onBlur,
  onKeyDown,
  ref,
  ...props
}: NumberFieldInputProps) {
  const context = useNumberFieldContext();

  const setInputRef = (node: HTMLInputElement | null) => {
    context.setInputElement(node);
    assignRef(ref, node);
  };

  return (
    <input
      {...context.aria}
      id={context.inputId}
      required={context.required || undefined}
      {...props}
      ref={setInputRef}
      type="text"
      role="spinbutton"
      inputMode={context.inputMode}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      value={context.text}
      disabled={context.disabled}
      readOnly={context.readOnly}
      aria-valuenow={context.value ?? undefined}
      aria-valuemin={context.min}
      aria-valuemax={context.max}
      aria-valuetext={context.formatted}
      data-slot="number-field-input"
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 flex-1 bg-transparent px-3 text-center text-base tabular-nums outline-none md:text-sm',
        'disabled:cursor-not-allowed',
        className,
      )}
      onChange={(event) => {
        onChange?.(event);
        context.setDraft(event.target.value);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        context.commit();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) context.onInputKeyDown(event);
      }}
    />
  );
}
NumberFieldInput.displayName = 'NumberFieldInput';

function useRepeatPress(action: () => boolean) {
  const actionRef = React.useRef(action);

  React.useLayoutEffect(() => {
    actionRef.current = action;
  });

  const [controller] = React.useState(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const stop = () => {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };

    const start = () => {
      stop();
      if (!actionRef.current()) return;
      let delay = 400;
      const tick = () => {
        if (!actionRef.current()) {
          stop();
          return;
        }
        delay = Math.max(40, delay * 0.75);
        timer = setTimeout(tick, delay);
      };
      timer = setTimeout(tick, delay);
      delay = 160;
      window.addEventListener('pointerup', stop);
      window.addEventListener('pointercancel', stop);
    };

    return { start, stop };
  });

  React.useEffect(() => controller.stop, [controller]);

  return controller;
}

function NumberFieldStepper({
  direction,
  className,
  children,
  onPointerDown,
  onPointerLeave,
  onClick,
  ref,
  ...props
}: NumberFieldButtonProps & { direction: 1 | -1 }) {
  const context = useNumberFieldContext();
  const enabled = direction === 1 ? context.canIncrement : context.canDecrement;
  const repeat = useRepeatPress(() => context.stepBy(direction * context.step));
  const increment = direction === 1;

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={increment ? 'Increase' : 'Decrease'}
      aria-controls={context.inputId}
      {...props}
      ref={ref}
      disabled={!enabled}
      data-slot={increment ? 'number-field-increment' : 'number-field-decrement'}
      data-disabled={enabled ? undefined : ''}
      className={cn(
        'border-input text-muted-foreground flex w-9 shrink-0 cursor-pointer items-center justify-center transition-colors outline-none select-none',
        'hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40',
        increment ? 'border-s' : 'border-e',
        className,
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0 || !enabled) return;
        event.preventDefault();
        repeat.start();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        repeat.stop();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && event.detail === 0) context.stepBy(direction * context.step);
      }}
    >
      {children ??
        (increment ? (
          <PlusIcon size={16} className="size-4" />
        ) : (
          <MinusIcon size={16} className="size-4" />
        ))}
    </button>
  );
}

function NumberFieldIncrement(props: NumberFieldButtonProps) {
  return <NumberFieldStepper direction={1} {...props} />;
}
NumberFieldIncrement.displayName = 'NumberFieldIncrement';

function NumberFieldDecrement(props: NumberFieldButtonProps) {
  return <NumberFieldStepper direction={-1} {...props} />;
}
NumberFieldDecrement.displayName = 'NumberFieldDecrement';

const NumberField = Object.assign(NumberFieldRoot, {
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
});

export { NumberField };
export type {
  NumberFieldButtonProps,
  NumberFieldGroupProps,
  NumberFieldInputProps,
  NumberFieldProps,
};
