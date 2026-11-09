'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';
import { format, type PlainDate, startOfMonth, today as getToday, type Weekday } from '../lib/date';
import { type Direction, resolveDirection, useDirection } from '../lib/direction';
import { FormValue, useFormReset } from '../lib/form-control';
import { assignRef, useIsClient } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';
import { Calendar, type DateRange } from './calendar';
import { Popover } from './popover';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function CalendarIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <rect x="2.5" y="4" width="19" height="17" rx="3.5" />
      <path d="M2.5 9.5h19" />
      <path d="M7.5 2.5v3" />
      <path d="M16.5 2.5v3" />
    </svg>
  );
}

const datePickerTriggerVariants = cva(
  [
    'border-input bg-transparent text-foreground flex w-full items-center gap-2 rounded-md border text-start transition-[color,box-shadow] outline-none',
    'dark:bg-input/30 hover:border-border-interactive',
    'focus-visible:border-foreground/40 focus-visible:ring-foreground/10 focus-visible:ring-[1px]',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/30',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
    'data-[placeholder=true]:text-muted-foreground',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs',
        default: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

type PresetValue<T> = T | (() => T);

interface DatePickerPreset<T> {
  label: string;
  value: PresetValue<T>;
}

interface DatePickerBaseProps
  extends
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'value' | 'defaultValue' | 'onChange' | 'children' | 'dir' | 'name' | 'form'
    >,
    VariantProps<typeof datePickerTriggerVariants> {
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  form?: string;
  required?: boolean;
  closeOnSelect?: boolean;
  numberOfMonths?: number;
  min?: PlainDate;
  max?: PlainDate;
  isDateDisabled?: (date: PlainDate) => boolean;
  locale?: string;
  weekStartsOn?: Weekday;
  today?: PlainDate;
  showOutsideDays?: boolean;
  dir?: Direction;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  showFooter?: boolean;
  todayLabel?: string;
  clearLabel?: string;
  dialogLabel?: string;
  calendarClassName?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: 'single';
  value?: PlainDate | null;
  defaultValue?: PlainDate | null;
  onValueChange?: (value: PlainDate | null) => void;
  presets?: ReadonlyArray<DatePickerPreset<PlainDate>>;
  rangeSeparator?: never;
}

interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: 'range';
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
  presets?: ReadonlyArray<DatePickerPreset<DateRange>>;
  rangeSeparator?: string;
}

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

type PickerValue = PlainDate | DateRange | null;

const footerButtonClass = cn(
  'text-foreground inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium outline-none transition-colors',
  'hover:bg-muted ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-40',
);

function startOf(value: PickerValue) {
  if (!value) return null;
  return typeof value === 'string' ? value : value.start;
}

const DatePicker = (props: DatePickerProps): React.JSX.Element => {
  const {
    mode = 'single',
    value: valueProp,
    defaultValue,
    onValueChange,
    presets,
    placeholder,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    name,
    form,
    required,
    disabled,
    closeOnSelect = true,
    numberOfMonths,
    min,
    max,
    isDateDisabled,
    locale,
    weekStartsOn,
    today: todayProp,
    showOutsideDays,
    dir,
    previousMonthLabel,
    nextMonthLabel,
    showFooter = false,
    todayLabel = 'Today',
    clearLabel = 'Clear',
    dialogLabel,
    calendarClassName,
    size,
    className,
    rangeSeparator = ' - ',
    ref,
    ...triggerProps
  } = props;

  const [value, setValue] = useControllableState<PickerValue>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange as ((value: PickerValue) => void) | undefined,
  });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [month, setMonth] = React.useState<PlainDate | null>(null);
  const [contentDir, setContentDir] = React.useState<Direction | undefined>(dir);
  const [labelled, setLabelled] = React.useState(false);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const valueId = React.useId();
  const isClient = useIsClient();
  const direction = useDirection(dir);

  useFormReset(wrapperRef, () => setValue(defaultValue ?? null), form);

  React.useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    setLabelled(
      Boolean(
        trigger.labels?.length ||
        trigger.hasAttribute('aria-label') ||
        trigger.hasAttribute('aria-labelledby'),
      ),
    );
  }, []);

  React.useLayoutEffect(() => {
    if (!open) return;
    setContentDir(resolveDirection(triggerRef.current, direction));
    setMonth((current) => current ?? startOfMonth(startOf(value) ?? todayProp ?? getToday()));
  }, [open, direction, value, todayProp]);

  const handleOpenChange = (next: boolean) => {
    if (disabled && next) return;
    if (!next) setMonth(null);
    setOpen(next);
  };

  const close = () => {
    setOpen(false);
    setMonth(null);
    triggerRef.current?.focus();
  };

  const commit = (next: PickerValue) => {
    setValue(next);
    const start = startOf(next);
    if (start) setMonth(startOfMonth(start));
    if (closeOnSelect && next) close();
  };

  const isDisabled = (date: PlainDate) =>
    Boolean((min && date < min) || (max && date > max) || isDateDisabled?.(date));

  const todayDate = open ? (todayProp ?? getToday()) : null;

  const handleContentFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    event.currentTarget
      .querySelector<HTMLButtonElement>('[data-slot="calendar-day"][tabindex="0"]')
      ?.focus();
  };

  const formatted = (() => {
    if (!value || (!isClient && locale === undefined)) return null;
    if (typeof value === 'string') return format(value, locale, { dateStyle: 'medium' });
    return `${format(value.start, locale, { dateStyle: 'medium' })}${rangeSeparator}${format(
      value.end,
      locale,
      { dateStyle: 'medium' },
    )}`;
  })();

  const formValue =
    mode === 'range'
      ? value && typeof value !== 'string'
        ? [value.start, value.end]
        : []
      : typeof value === 'string'
        ? value
        : '';

  const calendarShared = {
    month: month ?? undefined,
    onMonthChange: setMonth,
    numberOfMonths: numberOfMonths ?? (mode === 'range' ? 2 : 1),
    min,
    max,
    isDateDisabled,
    locale,
    weekStartsOn,
    today: todayProp,
    showOutsideDays,
    dir: contentDir,
    previousMonthLabel,
    nextMonthLabel,
    className: calendarClassName,
  };

  return (
    <div
      ref={wrapperRef}
      data-slot="date-picker"
      data-state={open ? 'open' : 'closed'}
      className="relative w-full [&>span]:flex"
    >
      <Popover open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger
          {...triggerProps}
          ref={(node: HTMLButtonElement | null) => {
            triggerRef.current = node;
            assignRef(ref, node);
          }}
          data-slot="date-picker-trigger"
          data-placeholder={!formatted}
          disabled={disabled}
          aria-describedby={
            labelled && formatted
              ? cn(triggerProps['aria-describedby'], valueId)
              : triggerProps['aria-describedby']
          }
          className={cn(datePickerTriggerVariants({ size }), className)}
        >
          <CalendarIcon size={16} className="text-muted-foreground size-4 shrink-0" />
          <span id={valueId} data-slot="date-picker-value" className="flex-1 truncate">
            {formatted ?? placeholder ?? ' '}
          </span>
        </Popover.Trigger>
        <Popover.Content
          data-slot="date-picker-content"
          aria-label={dialogLabel}
          dir={contentDir}
          onFocus={handleContentFocus}
          className="w-auto max-w-[calc(100vw-1rem)] p-0"
        >
          <div className="flex flex-col sm:flex-row">
            {presets && presets.length > 0 && (
              <div
                data-slot="date-picker-presets"
                className="border-border flex flex-row flex-wrap gap-0.5 border-b p-1 sm:w-36 sm:flex-col sm:border-e sm:border-b-0"
              >
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    data-slot="date-picker-preset"
                    onClick={() =>
                      commit(typeof preset.value === 'function' ? preset.value() : preset.value)
                    }
                    className="text-foreground hover:bg-muted focus-visible:bg-muted flex items-center rounded-sm px-2 py-1.5 text-start text-sm transition-colors outline-none"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-col">
              {mode === 'range' ? (
                <Calendar
                  {...calendarShared}
                  mode="range"
                  value={value && typeof value !== 'string' ? value : null}
                  onValueChange={commit}
                />
              ) : (
                <Calendar
                  {...calendarShared}
                  mode="single"
                  value={typeof value === 'string' ? value : null}
                  onValueChange={commit}
                />
              )}
              {showFooter && (
                <div
                  data-slot="date-picker-footer"
                  className="border-border flex items-center justify-between gap-2 border-t p-2"
                >
                  <button
                    type="button"
                    data-slot="date-picker-today"
                    disabled={!todayDate || isDisabled(todayDate)}
                    onClick={() => {
                      if (!todayDate) return;
                      commit(mode === 'range' ? { start: todayDate, end: todayDate } : todayDate);
                    }}
                    className={footerButtonClass}
                  >
                    {todayLabel}
                  </button>
                  <button
                    type="button"
                    data-slot="date-picker-clear"
                    disabled={!value}
                    onClick={() => setValue(null)}
                    className={footerButtonClass}
                  >
                    {clearLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover>
      <FormValue
        name={name}
        value={formValue}
        required={required}
        disabled={disabled}
        form={form}
        onFocus={() => triggerRef.current?.focus()}
      />
    </div>
  );
};

export { DatePicker, datePickerTriggerVariants };
export type { DatePickerPreset, DatePickerProps, DatePickerRangeProps, DatePickerSingleProps };
