'use client';

import * as React from 'react';
import { cn } from '../lib/cn';
import {
  addDays,
  addMonths,
  addYears,
  clamp,
  endOfMonth,
  endOfWeek,
  format,
  monthGrid,
  type PlainDate,
  startOfMonth,
  startOfWeek,
  today as getToday,
  toUTC,
  type Weekday,
  weekdayNames,
  weekStartFor,
} from '../lib/date';
import { type Direction, resolveDirection, useDirection } from '../lib/direction';
import { assignRef, useIsClient } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function ChevronLeftIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

interface DateRange {
  start: PlainDate;
  end: PlainDate;
}

type CalendarValue = PlainDate | DateRange | null;

interface CalendarBaseProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'dir'
> {
  month?: PlainDate;
  defaultMonth?: PlainDate;
  onMonthChange?: (month: PlainDate) => void;
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
  ref?: React.Ref<HTMLDivElement>;
}

interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single';
  value?: PlainDate | null;
  defaultValue?: PlainDate | null;
  onValueChange?: (value: PlainDate) => void;
}

interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange) => void;
}

type CalendarProps = CalendarSingleProps | CalendarRangeProps;

const LABEL_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};

const navButtonClass = cn(
  'border-border text-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-md border bg-transparent outline-none transition-colors',
  'hover:bg-muted ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-40',
);

function rangeOf(value: CalendarValue): DateRange | null {
  if (!value) return null;
  if (typeof value === 'string') return { start: value, end: value };
  return value;
}

function ordered(a: PlainDate, b: PlainDate): DateRange {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}

const CalendarRoot = (props: CalendarProps): React.JSX.Element => {
  const {
    mode = 'single',
    value: valueProp,
    defaultValue,
    onValueChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    min,
    max,
    isDateDisabled,
    locale,
    weekStartsOn,
    today: todayProp,
    showOutsideDays = true,
    dir,
    previousMonthLabel = 'Previous month',
    nextMonthLabel = 'Next month',
    className,
    ref,
    ...rest
  } = props;

  const [value, setValue] = useControllableState<CalendarValue>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange as ((value: CalendarValue) => void) | undefined,
  });
  const [month, setMonth] = useControllableState<PlainDate | null>({
    value: monthProp,
    defaultValue: defaultMonth ? startOfMonth(defaultMonth) : null,
    onChange: (next) => {
      if (next) onMonthChange?.(next);
    },
  });
  const [anchor, setAnchor] = React.useState<PlainDate | null>(null);
  const [hovered, setHovered] = React.useState<PlainDate | null>(null);
  const [focused, setFocused] = React.useState<PlainDate | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const focusPendingRef = React.useRef(false);
  const id = React.useId();
  const isClient = useIsClient();
  const direction = useDirection(dir);

  const todayDate = React.useMemo(
    () => todayProp ?? (isClient ? getToday() : undefined),
    [todayProp, isClient],
  );
  const selection = rangeOf(value);
  const count = Math.max(1, Math.floor(numberOfMonths));
  const anchorMonth = month ?? selection?.start ?? todayDate;
  const firstMonth = anchorMonth ? startOfMonth(anchorMonth) : null;
  const ready = firstMonth !== null && (isClient || locale !== undefined);
  const weekStart = weekStartsOn ?? weekStartFor(locale);
  const outside = showOutsideDays && count === 1;

  const months = React.useMemo(
    () =>
      firstMonth ? Array.from({ length: count }, (_, index) => addMonths(firstMonth, index)) : [],
    [firstMonth, count],
  );
  const viewStart = months[0];
  const lastMonth = months[months.length - 1];
  const viewEnd = lastMonth ? endOfMonth(lastMonth) : undefined;

  const formatters = React.useMemo(
    () => ({
      label: new Intl.DateTimeFormat(locale, LABEL_OPTIONS),
      day: new Intl.DateTimeFormat(locale, { day: 'numeric', timeZone: 'UTC' }),
    }),
    [locale],
  );
  const shortDays = React.useMemo(
    () => weekdayNames(locale, weekStart, 'short'),
    [locale, weekStart],
  );
  const longDays = React.useMemo(
    () => weekdayNames(locale, weekStart, 'long'),
    [locale, weekStart],
  );

  const isDisabled = React.useCallback(
    (date: PlainDate) =>
      Boolean((min && date < min) || (max && date > max) || isDateDisabled?.(date)),
    [min, max, isDateDisabled],
  );

  const inView = React.useCallback(
    (date: PlainDate | null | undefined) =>
      Boolean(date && viewStart && viewEnd && date >= viewStart && date <= viewEnd),
    [viewStart, viewEnd],
  );

  const activeDate = React.useMemo(() => {
    const candidate = [focused, anchor, selection?.start, todayDate].find(
      (date): date is PlainDate => inView(date),
    );
    if (candidate || !viewStart || !viewEnd) return candidate ?? null;
    for (let date = viewStart; date <= viewEnd; date = addDays(date, 1)) {
      if (!isDisabled(date)) return date;
    }
    return viewStart;
  }, [focused, anchor, selection?.start, todayDate, inView, viewStart, viewEnd, isDisabled]);

  const preview = anchor ? ordered(anchor, hovered ?? anchor) : null;
  const shown = mode === 'range' ? (preview ?? selection) : null;

  React.useLayoutEffect(() => {
    if (!focusPendingRef.current || !activeDate) return;
    focusPendingRef.current = false;
    rootRef.current
      ?.querySelector<HTMLButtonElement>(
        `[data-slot="calendar-day"][data-date="${activeDate}"]:not([data-outside])`,
      )
      ?.focus();
  });

  const showMonthOf = React.useCallback(
    (date: PlainDate) => {
      if (inView(date) || !viewStart) return;
      setMonth(date < viewStart ? startOfMonth(date) : addMonths(startOfMonth(date), -(count - 1)));
    },
    [inView, viewStart, count, setMonth],
  );

  const moveFocus = (date: PlainDate) => {
    focusPendingRef.current = true;
    setFocused(date);
    if (anchor) setHovered(date);
    showMonthOf(date);
  };

  const select = (date: PlainDate) => {
    if (isDisabled(date)) return;
    setFocused(date);
    showMonthOf(date);
    if (mode === 'single') {
      setValue(date);
      return;
    }
    if (!anchor) {
      setAnchor(date);
      setHovered(date);
      return;
    }
    setAnchor(null);
    setHovered(null);
    setValue(ordered(anchor, date));
  };

  const handleDayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const date = event.currentTarget.dataset.date;
    if (date) select(date);
  };

  const handleDayHover = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const date = event.currentTarget.dataset.date;
    if (anchor && date) setHovered(date);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    const current = (event.target as HTMLElement).closest<HTMLElement>('[data-slot="calendar-day"]')
      ?.dataset.date;
    if (!current || event.altKey || event.ctrlKey || event.metaKey) return;
    const rtl = resolveDirection(rootRef.current, direction) === 'rtl';
    let next: PlainDate;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(current, rtl ? 1 : -1);
        break;
      case 'ArrowRight':
        next = addDays(current, rtl ? -1 : 1);
        break;
      case 'ArrowUp':
        next = addDays(current, -7);
        break;
      case 'ArrowDown':
        next = addDays(current, 7);
        break;
      case 'PageUp':
        next = event.shiftKey ? addYears(current, -1) : addMonths(current, -1);
        break;
      case 'PageDown':
        next = event.shiftKey ? addYears(current, 1) : addMonths(current, 1);
        break;
      case 'Home':
        next = startOfWeek(current, weekStart);
        break;
      case 'End':
        next = endOfWeek(current, weekStart);
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(clamp(next, min, max));
  };

  const goToMonth = (next: PlainDate) => {
    setFocused(null);
    setMonth(next);
  };

  const previousDisabled = !ready || Boolean(min && viewStart && addDays(viewStart, -1) < min);
  const nextDisabled = !ready || Boolean(max && viewStart && addMonths(viewStart, count) > max);

  const slots = ready ? months : [null];

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      data-slot="calendar"
      data-mode={mode}
      dir={dir}
      className={cn('inline-block p-3', className)}
      {...rest}
    >
      <div data-slot="calendar-months" className="flex flex-col gap-4 sm:flex-row">
        {slots.map((monthStart, index) => {
          const titleId = `${id}-title-${index}`;
          const grid = monthStart ? monthGrid(monthStart, weekStart) : [];
          return (
            <div
              key={monthStart ?? 'placeholder'}
              data-slot="calendar-month"
              className="flex flex-col gap-3"
            >
              <div data-slot="calendar-header" className="flex h-8 items-center gap-2">
                {index === 0 ? (
                  <button
                    type="button"
                    data-slot="calendar-previous"
                    aria-label={previousMonthLabel}
                    disabled={previousDisabled}
                    onClick={() => viewStart && goToMonth(addMonths(viewStart, -1))}
                    className={navButtonClass}
                  >
                    <ChevronLeftIcon size={16} className="size-4 rtl:-scale-x-100" />
                  </button>
                ) : (
                  <span aria-hidden="true" className="size-8 shrink-0" />
                )}
                <div
                  id={titleId}
                  data-slot="calendar-title"
                  aria-live="polite"
                  className="flex-1 text-center text-sm font-medium"
                >
                  {monthStart ? format(monthStart, locale, { month: 'long', year: 'numeric' }) : ''}
                </div>
                {index === slots.length - 1 ? (
                  <button
                    type="button"
                    data-slot="calendar-next"
                    aria-label={nextMonthLabel}
                    disabled={nextDisabled}
                    onClick={() => viewStart && goToMonth(addMonths(viewStart, 1))}
                    className={navButtonClass}
                  >
                    <ChevronRightIcon size={16} className="size-4 rtl:-scale-x-100" />
                  </button>
                ) : (
                  <span aria-hidden="true" className="size-8 shrink-0" />
                )}
              </div>
              <table
                role="grid"
                aria-labelledby={titleId}
                data-slot="calendar-grid"
                onKeyDown={handleKeyDown}
                className="border-collapse"
              >
                <thead>
                  <tr data-slot="calendar-weekdays">
                    {Array.from({ length: 7 }, (_, column) => (
                      <th
                        key={column}
                        scope="col"
                        abbr={ready ? longDays[column] : undefined}
                        data-slot="calendar-weekday"
                        className="text-muted-foreground size-10 p-0 text-xs font-normal"
                      >
                        {ready ? shortDays[column] : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }, (_, row) => (
                    <tr key={row} data-slot="calendar-week">
                      {Array.from({ length: 7 }, (_, column) => {
                        const date = grid[row * 7 + column];
                        if (!date || !monthStart) {
                          return <td key={column} role="gridcell" className="size-10 p-0" />;
                        }
                        const isOutside = date.slice(0, 7) !== monthStart.slice(0, 7);
                        if (isOutside && !outside) {
                          return <td key={column} role="gridcell" className="size-10 p-0" />;
                        }
                        const disabled = isDisabled(date);
                        const isToday = date === todayDate;
                        const rangeStart = shown?.start === date;
                        const rangeEnd = shown?.end === date;
                        const rangeMiddle = Boolean(
                          shown && date > shown.start && date < shown.end,
                        );
                        const selected =
                          mode === 'single'
                            ? value === date
                            : rangeStart || rangeEnd || rangeMiddle;
                        const band = Boolean(shown && shown.start !== shown.end && !isOutside);
                        const monthFirst = date.endsWith('-01');
                        const monthLast = addDays(date, 1).endsWith('-01');
                        const bandStart = band && rangeStart && !monthLast;
                        const bandEnd = band && rangeEnd && !monthFirst;
                        const bandMiddle = band && rangeMiddle;
                        return (
                          <td
                            key={column}
                            role="gridcell"
                            aria-selected={selected}
                            aria-disabled={disabled || undefined}
                            data-slot="calendar-cell"
                            className={cn(
                              'relative size-10 p-0 text-center',
                              (bandStart || bandEnd || bandMiddle) &&
                                'before:bg-muted before:absolute before:inset-y-0.5 first:before:rounded-s-md last:before:rounded-e-md',
                              bandMiddle && 'before:inset-x-0',
                              bandStart && 'before:start-1/2 before:end-0',
                              bandEnd && 'before:start-0 before:end-1/2',
                              bandMiddle && monthFirst && 'before:rounded-s-md',
                              bandMiddle && monthLast && 'before:rounded-e-md',
                            )}
                          >
                            <button
                              type="button"
                              tabIndex={date === activeDate && !isOutside ? 0 : -1}
                              aria-label={formatters.label.format(toUTC(date))}
                              aria-disabled={disabled || undefined}
                              aria-current={isToday ? 'date' : undefined}
                              data-slot="calendar-day"
                              data-date={date}
                              data-selected={selected || undefined}
                              data-today={isToday || undefined}
                              data-outside={isOutside || undefined}
                              data-disabled={disabled || undefined}
                              data-range-start={rangeStart || undefined}
                              data-range-end={rangeEnd || undefined}
                              data-range-middle={rangeMiddle || undefined}
                              onClick={handleDayClick}
                              onPointerEnter={handleDayHover}
                              onFocus={handleDayHover}
                              className={cn(
                                'relative inline-flex size-9 items-center justify-center rounded-md text-sm tabular-nums transition-colors outline-none',
                                'hover:bg-muted ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
                                isToday && 'inset-ring-border-interactive font-medium inset-ring',
                                isOutside && 'text-muted-foreground opacity-60',
                                rangeMiddle && 'hover:bg-foreground/5',
                                (mode === 'single' ? selected : rangeStart || rangeEnd) &&
                                  'bg-primary text-primary-foreground hover:bg-primary/90',
                                disabled &&
                                  'cursor-not-allowed line-through opacity-35 hover:bg-transparent',
                              )}
                            >
                              {formatters.day.format(toUTC(date))}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Calendar = CalendarRoot;

export { Calendar };
export type { CalendarProps, CalendarRangeProps, CalendarSingleProps, DateRange };
