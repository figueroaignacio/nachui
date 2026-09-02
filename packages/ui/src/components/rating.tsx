'use client';

import { StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type RatingSize = 'sm' | 'default' | 'lg';
type RatingPrecision = 1 | 0.5;

const RATING_SIZE_CLASSES: Record<RatingSize, string> = {
  sm: 'size-4',
  default: 'size-5',
  lg: 'size-7',
};

interface RatingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  precision?: RatingPrecision;
  size?: RatingSize;
  readOnly?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  name?: string;
  icon?: React.ReactNode;
  filledIcon?: React.ReactNode;
  getLabel?: (value: number, max: number) => string;
}

function roundToPrecision(value: number, precision: RatingPrecision): number {
  return Math.round(value / precision) * precision;
}

function defaultLabel(value: number, max: number): string {
  return `${value} of ${max}`;
}

const RatingRoot = ({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  max = 5,
  precision = 1,
  size = 'default',
  readOnly = false,
  disabled = false,
  allowClear = false,
  name,
  icon,
  filledIcon,
  getLabel = defaultLabel,
  className,
  children,
  onKeyDown,
  onPointerLeave,
  ref,
  ...props
}: RatingProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const interactive = !readOnly && !disabled;
  const displayed = hoverValue ?? value;

  const setValue = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), max);
      if (!isControlled) setUncontrolledValue(clamped);
      onValueChange?.(clamped);
    },
    [isControlled, max, onValueChange],
  );

  const valueFromPointer = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    if (precision === 1) return index + 1;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 1;
    return index + (ratio <= 0.5 ? 0.5 : 1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!interactive || event.defaultPrevented) return;

    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = value + precision;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = value - precision;
    else if (event.key === 'Home') next = precision;
    else if (event.key === 'End') next = max;
    else if (event.key === 'Backspace' || event.key === 'Delete') next = 0;

    if (next === null) return;
    event.preventDefault();
    setValue(roundToPrecision(next, precision));
  };

  const focusIndex = Math.max(Math.ceil(value) - 1, 0);
  const items = Array.from({ length: max }, (_, index) => index);
  const label = getLabel(value, max);

  const renderIcon = (fill: number) => {
    const outline = icon ?? <HugeiconsIcon icon={StarIcon} strokeWidth={1.5} />;
    const filled = filledIcon ?? (
      <HugeiconsIcon icon={StarIcon} strokeWidth={1.5} fill="currentColor" />
    );

    return (
      <span
        aria-hidden="true"
        className={cn(
          'text-muted-foreground/60 relative block [&_svg]:size-full',
          RATING_SIZE_CLASSES[size],
        )}
      >
        {outline}
        <span
          data-slot="rating-fill"
          className="text-warning absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${Math.min(Math.max(fill, 0), 1) * 100}%` }}
        >
          <span className={cn('block', RATING_SIZE_CLASSES[size])}>{filled}</span>
        </span>
      </span>
    );
  };

  return (
    <div
      ref={ref}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? label : undefined}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      data-slot="rating"
      data-value={value}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      onKeyDown={handleKeyDown}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setHoverValue(null);
      }}
      className={cn(
        'inline-flex items-center gap-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-0.5" data-slot="rating-items">
        {items.map((index) => {
          const fill = Math.min(Math.max(displayed - index, 0), 1);
          const itemValue = index + 1;

          if (readOnly) {
            return (
              <span key={index} data-slot="rating-item" className="inline-flex">
                {renderIcon(fill)}
              </span>
            );
          }

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={Math.ceil(value) === itemValue}
              aria-label={getLabel(itemValue, max)}
              tabIndex={index === focusIndex ? 0 : -1}
              disabled={disabled}
              data-slot="rating-item"
              data-active={fill > 0 ? '' : undefined}
              onPointerMove={(event) => {
                if (!interactive || event.pointerType === 'touch') return;
                setHoverValue(valueFromPointer(event, index));
              }}
              onPointerDown={(event) => {
                if (!interactive) return;
                const next = valueFromPointer(event, index);
                setValue(allowClear && next === value ? 0 : next);
                setHoverValue(null);
              }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && interactive) {
                  event.preventDefault();
                  setValue(allowClear && itemValue === value ? 0 : itemValue);
                }
              }}
              className={cn(
                'focus-visible:ring-ring inline-flex cursor-pointer rounded-sm transition-transform outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                interactive && 'hover:scale-110',
                disabled && 'pointer-events-none',
              )}
            >
              {renderIcon(fill)}
            </button>
          );
        })}
      </span>
      {children}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
};
RatingRoot.displayName = 'Rating';

const Rating = RatingRoot;

export { Rating };
export type { RatingProps, RatingSize, RatingPrecision };
