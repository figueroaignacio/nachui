'use client';

import * as React from 'react';
import { cn } from '../lib/cn';
import { resolveDirection, useDirection, type Direction } from '../lib/direction';
import { FormValue, useFormReset } from '../lib/form-control';
import { assignRef } from '../lib/overlay';
import { useControllableState } from '../lib/use-controllable-state';

type SliderOrientation = 'horizontal' | 'vertical';

interface SliderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'dir'
> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  minStepsBetweenThumbs?: number;
  orientation?: SliderOrientation;
  dir?: Direction;
  disabled?: boolean;
  inverted?: boolean;
  name?: string;
  form?: string;
  getAriaValueText?: (value: number, index: number) => string;
  ref?: React.Ref<HTMLDivElement>;
}

interface SliderTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

interface SliderRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

interface SliderThumbProps extends React.HTMLAttributes<HTMLSpanElement> {
  index?: number;
  ref?: React.Ref<HTMLSpanElement>;
}

interface SliderContextValue {
  values: number[];
  min: number;
  max: number;
  orientation: SliderOrientation;
  inverted: boolean;
  disabled: boolean;
  draggingIndex: number | null;
  getAriaValueText?: (value: number, index: number) => string;
  trackRef: React.RefObject<HTMLDivElement | null>;
  thumbsRef: React.RefObject<Map<number, HTMLElement>>;
  onThumbKeyDown: (index: number, event: React.KeyboardEvent<HTMLElement>) => void;
}

interface DragState {
  index: number;
  candidates: number[] | null;
  offset: number;
  start: number[];
  pointerId: number;
}

const SliderContext = React.createContext<SliderContextValue | null>(null);

const ThumbIndexContext = React.createContext<number | null>(null);

function useSliderContext(): SliderContextValue {
  const context = React.use(SliderContext);
  if (!context) throw new Error('Slider components must be used within Slider');
  return context;
}

function decimalsOf(value: number) {
  if (!Number.isFinite(value)) return 0;
  const [, fraction = ''] = String(value).split('.');
  return fraction.length;
}

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

function snapToStep(value: number, min: number, step: number) {
  if (step <= 0) return value;
  const snapped = min + Math.round((value - min) / step) * step;
  return Number(snapped.toFixed(Math.max(decimalsOf(step), decimalsOf(min))));
}

function toPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

function closestIndex(values: number[], target: number) {
  let best = 0;
  let bestDistance = Infinity;
  values.forEach((value, index) => {
    const distance = Math.abs(value - target);
    if (distance < bestDistance || (distance === bestDistance && target > value)) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

function sameValues(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function SliderRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  largeStep = 10,
  minStepsBetweenThumbs = 0,
  orientation = 'horizontal',
  dir: dirProp,
  disabled = false,
  inverted = false,
  name,
  form,
  getAriaValueText,
  className,
  children,
  ref,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: SliderProps) {
  const [values, setValues] = useControllableState<number[]>({
    value: valueProp,
    defaultValue: defaultValue ?? [min],
    onChange: onValueChange,
  });
  const dir = useDirection(dirProp);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const thumbsRef = React.useRef(new Map<number, HTMLElement>());
  const valuesRef = React.useRef(values);
  const dragRef = React.useRef<DragState | null>(null);
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const initialRef = React.useRef(defaultValue ?? [min]);
  const commitRef = React.useRef(onValueCommit);

  React.useLayoutEffect(() => {
    valuesRef.current = values;
    commitRef.current = onValueCommit;
  });

  useFormReset(rootRef, () => setValues(initialRef.current), form);

  const horizontal = orientation === 'horizontal';
  const gap = minStepsBetweenThumbs * step;

  const updateAt = (index: number, raw: number) => {
    const current = valuesRef.current;
    const previous = current[index];
    if (previous === undefined) return false;
    const lower = index > 0 ? (current[index - 1] ?? min) + gap : min;
    const upper = index < current.length - 1 ? (current[index + 1] ?? max) - gap : max;
    const next = clamp(clamp(snapToStep(raw, min, step), min, max), lower, upper);
    if (next === previous) return false;
    const nextValues = current.slice();
    nextValues[index] = next;
    valuesRef.current = nextValues;
    setValues(nextValues);
    return true;
  };

  const valueFromPointer = (clientX: number, clientY: number) => {
    const element = trackRef.current ?? rootRef.current;
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    let fraction: number;
    if (horizontal) {
      if (rect.width === 0) return null;
      const fromLeft = (clientX - rect.left) / rect.width;
      fraction = resolveDirection(rootRef.current, dir) === 'rtl' ? 1 - fromLeft : fromLeft;
    } else {
      if (rect.height === 0) return null;
      fraction = (rect.bottom - clientY) / rect.height;
    }
    if (inverted) fraction = 1 - fraction;
    return min + clamp(fraction, 0, 1) * (max - min);
  };

  const focusThumb = (index: number) => {
    thumbsRef.current.get(index)?.focus({ preventScroll: true });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || disabled || event.button !== 0) return;
    const pointerValue = valueFromPointer(event.clientX, event.clientY);
    if (pointerValue === null) return;
    const current = valuesRef.current;
    if (current.length === 0) return;

    let hitIndex: number | null = null;
    for (const [index, element] of thumbsRef.current) {
      if (element.contains(event.target as Node)) hitIndex = index;
    }

    let index: number;
    let offset = 0;
    let candidates: number[] | null = null;
    if (hitIndex !== null && current[hitIndex] !== undefined) {
      const hitValue = current[hitIndex] ?? 0;
      offset = pointerValue - hitValue;
      const stacked = current.flatMap((value, position) => (value === hitValue ? [position] : []));
      candidates = stacked.length > 1 ? stacked : null;
      index = hitIndex;
    } else {
      index = closestIndex(current, pointerValue);
      updateAt(index, pointerValue);
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { index, candidates, offset, start: current, pointerId: event.pointerId };
    setDraggingIndex(index);
    focusThumb(index);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const pointerValue = valueFromPointer(event.clientX, event.clientY);
    if (pointerValue === null) return;
    const target = pointerValue - drag.offset;
    if (drag.candidates) {
      const anchor = valuesRef.current[drag.index] ?? 0;
      if (target === anchor) return;
      const lowest = drag.candidates[0] ?? drag.index;
      const highest = drag.candidates[drag.candidates.length - 1] ?? drag.index;
      drag.index = target < anchor ? lowest : highest;
      drag.candidates = null;
      setDraggingIndex(drag.index);
      focusThumb(drag.index);
    }
    updateAt(drag.index, target);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDraggingIndex(null);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!sameValues(drag.start, valuesRef.current)) commitRef.current?.(valuesRef.current);
  };

  const onThumbKeyDown = (index: number, event: React.KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    const rtl = resolveDirection(rootRef.current, dir) === 'rtl';
    const current = valuesRef.current[index];
    if (current === undefined) return;
    const amount = event.shiftKey ? largeStep : step;
    const rightSign = horizontal ? (rtl === inverted ? 1 : -1) : rtl ? -1 : 1;
    const upSign = !horizontal && inverted ? -1 : 1;

    let target: number;
    switch (event.key) {
      case 'ArrowRight':
        target = current + rightSign * amount;
        break;
      case 'ArrowLeft':
        target = current - rightSign * amount;
        break;
      case 'ArrowUp':
        target = current + upSign * amount;
        break;
      case 'ArrowDown':
        target = current - upSign * amount;
        break;
      case 'PageUp':
        target = current + largeStep;
        break;
      case 'PageDown':
        target = current - largeStep;
        break;
      case 'Home':
        target = min;
        break;
      case 'End':
        target = max;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (updateAt(index, target)) commitRef.current?.(valuesRef.current);
  };

  const setRootRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    assignRef(ref, node);
  };

  const childArray = React.Children.toArray(children);
  const thumbChildren = childArray.filter(
    (child) => React.isValidElement(child) && child.type === SliderThumb,
  );
  const indexedChildren = childArray.map((child) => {
    const index = thumbChildren.indexOf(child);
    if (index === -1 || !React.isValidElement(child)) return child;
    return (
      <ThumbIndexContext key={child.key} value={index}>
        {child}
      </ThumbIndexContext>
    );
  });

  const labelled = Boolean(props['aria-label'] || props['aria-labelledby']);

  const context: SliderContextValue = {
    values,
    min,
    max,
    orientation,
    inverted,
    disabled,
    draggingIndex,
    getAriaValueText,
    trackRef,
    thumbsRef,
    onThumbKeyDown,
  };

  return (
    <SliderContext value={context}>
      <div
        ref={setRootRef}
        role={labelled ? 'group' : undefined}
        dir={dir}
        data-slot="slider"
        data-orientation={orientation}
        data-disabled={disabled ? '' : undefined}
        data-dragging={draggingIndex !== null ? '' : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          'relative flex touch-none items-center select-none',
          horizontal ? 'h-5 w-full' : 'h-40 w-5 flex-col',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
          className,
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          endDrag(event);
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          endDrag(event);
        }}
        {...props}
      >
        {indexedChildren}
        <FormValue name={name} value={values.map(String)} form={form} disabled={disabled} />
      </div>
    </SliderContext>
  );
}
SliderRoot.displayName = 'Slider';

function SliderTrack({ className, ref, ...props }: SliderTrackProps) {
  const { orientation, trackRef } = useSliderContext();

  const setTrackRef = (node: HTMLDivElement | null) => {
    trackRef.current = node;
    assignRef(ref, node);
  };

  return (
    <div
      ref={setTrackRef}
      data-slot="slider-track"
      data-orientation={orientation}
      className={cn(
        'bg-muted relative grow overflow-hidden rounded-full',
        orientation === 'horizontal' ? 'h-1 w-full' : 'h-full w-1',
        className,
      )}
      {...props}
    />
  );
}
SliderTrack.displayName = 'SliderTrack';

function SliderRange({ className, style, ref, ...props }: SliderRangeProps) {
  const { values, min, max, orientation, inverted } = useSliderContext();
  const offsets = values.map((value) => {
    const percent = toPercent(value, min, max);
    return inverted ? 100 - percent : percent;
  });
  const single = offsets.length === 1;
  const first = offsets[0] ?? 0;
  const start = single ? (inverted ? first : 0) : Math.min(...offsets);
  const end = single ? (inverted ? 100 : first) : Math.max(...offsets);
  const position: React.CSSProperties =
    orientation === 'horizontal'
      ? { insetInlineStart: `${start}%`, insetInlineEnd: `${100 - end}%` }
      : { bottom: `${start}%`, top: `${100 - end}%` };

  return (
    <div
      ref={ref}
      data-slot="slider-range"
      data-orientation={orientation}
      className={cn(
        'bg-primary absolute rounded-full',
        orientation === 'horizontal' ? 'h-full' : 'w-full',
        className,
      )}
      style={{ ...position, ...style }}
      {...props}
    />
  );
}
SliderRange.displayName = 'SliderRange';

function SliderThumb({
  index: indexProp,
  className,
  style,
  ref,
  onKeyDown,
  ...props
}: SliderThumbProps) {
  const context = useSliderContext();
  const contextIndex = React.use(ThumbIndexContext);
  const index = indexProp ?? contextIndex ?? 0;
  const { values, min, max, orientation, inverted, disabled, draggingIndex, thumbsRef } = context;
  const value = values[index];

  const setThumbRef = (node: HTMLSpanElement | null) => {
    if (node) thumbsRef.current.set(index, node);
    else thumbsRef.current.delete(index);
    assignRef(ref, node);
  };

  if (value === undefined) return null;

  const percent = toPercent(value, min, max);
  const offset = inverted ? 100 - percent : percent;
  const horizontal = orientation === 'horizontal';
  const position: React.CSSProperties = horizontal
    ? { insetInlineStart: `${offset}%` }
    : { bottom: `${offset}%` };

  return (
    <span
      ref={setThumbRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={context.getAriaValueText?.(value, index)}
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      data-slot="slider-thumb"
      data-index={index}
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
      data-dragging={draggingIndex === index ? '' : undefined}
      className={cn(
        'bg-card border-border-interactive absolute block size-[18px] rounded-full border shadow-sm transition-[border-color,box-shadow] outline-none',
        'before:absolute before:-inset-[13px] before:rounded-full',
        'hover:border-foreground/40 data-[dragging]:border-foreground/40',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-2',
        horizontal ? '-translate-x-1/2 rtl:translate-x-1/2' : 'translate-y-1/2',
        className,
      )}
      style={{ ...position, ...style }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) context.onThumbKeyDown(index, event);
      }}
      {...props}
    />
  );
}
SliderThumb.displayName = 'SliderThumb';

const Slider = Object.assign(SliderRoot, {
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
});

export { Slider };
export type {
  SliderOrientation,
  SliderProps,
  SliderRangeProps,
  SliderThumbProps,
  SliderTrackProps,
};
