'use client';

import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';
import type { Direction } from '../lib/direction';
import {
  RovingFocusContext,
  type RovingOrientation,
  useComposedRef,
  useRovingFocusGroup,
  useRovingFocusItem,
} from '../lib/roving-focus';
import { useControllableState } from '../lib/use-controllable-state';
import { toggleVariants } from './toggle';

const toggleGroupVariants = cva('inline-flex w-fit', {
  variants: {
    variant: {
      default: 'gap-0.5 rounded-md border border-border bg-card p-0.5',
      outline: 'rounded-md border border-input',
    },
    orientation: {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col items-stretch',
    },
  },
  compoundVariants: [{ variant: 'outline', orientation: 'horizontal', className: 'items-stretch' }],
  defaultVariants: {
    variant: 'default',
    orientation: 'horizontal',
  },
});

const toggleGroupItemVariants = cva('', {
  variants: {
    variant: {
      default: 'rounded-sm',
      outline: 'rounded-none border-input focus-visible:z-10',
    },
    orientation: {
      horizontal: '',
      vertical: '',
    },
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  compoundVariants: [
    {
      variant: 'outline',
      orientation: 'horizontal',
      className: 'border-s first:rounded-s-md first:border-s-0 last:rounded-e-md',
    },
    {
      variant: 'outline',
      orientation: 'vertical',
      className: 'border-t first:rounded-t-md first:border-t-0 last:rounded-b-md',
    },
    { variant: 'default', size: 'sm', className: 'h-7 min-w-7 px-1.5' },
    { variant: 'default', size: 'default', className: 'h-8 min-w-8 px-2' },
    { variant: 'default', size: 'lg', className: 'h-9 min-w-9 px-2.5' },
  ],
});

type ToggleGroupVariant = 'default' | 'outline';
type ToggleGroupSize = 'sm' | 'default' | 'lg';

interface ToggleGroupContextValue {
  values: string[];
  toggle: (value: string) => void;
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
  orientation: RovingOrientation;
  disabled: boolean;
  nested: boolean;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext() {
  const context = React.use(ToggleGroupContext);
  if (!context) throw new Error('ToggleGroup.Item must be used within ToggleGroup');
  return context;
}

const isPressedElement = (element: HTMLElement) => element.getAttribute('aria-pressed') === 'true';

interface ToggleGroupSharedProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'dir'
> {
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  orientation?: RovingOrientation;
  dir?: Direction;
  loop?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

interface ToggleGroupSingleProps extends ToggleGroupSharedProps {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}

interface ToggleGroupMultipleProps extends ToggleGroupSharedProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  required?: never;
}

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ToggleGroupRoot = ({
  type,
  value: valueProp,
  defaultValue,
  onValueChange,
  required = false,
  variant = 'default',
  size = 'default',
  orientation = 'horizontal',
  dir,
  loop = true,
  disabled = false,
  className,
  onBlur,
  children,
  ref,
  ...props
}: ToggleGroupProps) => {
  const [rawValue, setRawValue] = useControllableState<string | string[]>({
    value: valueProp,
    defaultValue: defaultValue ?? (type === 'single' ? '' : []),
    onChange: onValueChange as ((value: string | string[]) => void) | undefined,
  });
  const values = React.useMemo(
    () => (Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : []),
    [rawValue],
  );

  const toggle = React.useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        setRawValue((previous) =>
          previous === itemValue ? (required ? previous : '') : itemValue,
        );
        return;
      }
      setRawValue((previous) => {
        const list = Array.isArray(previous) ? previous : [];
        return list.includes(itemValue)
          ? list.filter((entry) => entry !== itemValue)
          : [...list, itemValue];
      });
    },
    [type, required, setRawValue],
  );

  const parentScope = React.use(RovingFocusContext);
  const nested = parentScope !== null;
  const roving = useRovingFocusGroup<HTMLDivElement>({
    orientation,
    dir,
    loop,
    isPreferred: isPressedElement,
    resetOnLeave: true,
  });
  const setGroupNode = useComposedRef(roving.setRoot, ref);

  const contextValue = React.useMemo<ToggleGroupContextValue>(
    () => ({ values, toggle, variant, size, orientation, disabled, nested }),
    [values, toggle, variant, size, orientation, disabled, nested],
  );

  return (
    <ToggleGroupContext value={contextValue}>
      <RovingFocusContext value={parentScope ?? roving.scope}>
        <div
          ref={setGroupNode}
          role="group"
          dir={dir}
          data-slot="toggle-group"
          data-variant={variant}
          data-orientation={orientation}
          data-disabled={disabled ? '' : undefined}
          className={cn(
            toggleGroupVariants({ variant, orientation }),
            nested && variant === 'default' && 'gap-1 border-0 bg-transparent p-0',
            className,
          )}
          {...props}
          onBlur={(event) => {
            onBlur?.(event);
            if (!nested) roving.onBlur(event);
          }}
        >
          {children}
        </div>
      </RovingFocusContext>
    </ToggleGroupContext>
  );
};
ToggleGroupRoot.displayName = 'ToggleGroup';

interface ToggleGroupItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value'
> {
  value: string;
  ref?: React.Ref<HTMLButtonElement>;
}

const ToggleGroupItem = ({
  value,
  className,
  disabled: disabledProp,
  onClick,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: ToggleGroupItemProps) => {
  const group = useToggleGroupContext();
  const disabled = group.disabled || Boolean(disabledProp);
  const pressed = group.values.includes(value);
  const item = useRovingFocusItem<HTMLButtonElement>({ disabled, onFocus, onKeyDown });
  const setItemNode = useComposedRef(item.setNode, ref);

  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-slot="toggle-group-item"
      data-state={pressed ? 'on' : 'off'}
      data-orientation={group.orientation}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      className={cn(
        toggleVariants({ variant: 'default', size: group.size }),
        toggleGroupItemVariants({
          variant: group.variant,
          orientation: group.orientation,
          size: group.size,
        }),
        group.nested && group.variant === 'default' && 'rounded-md',
        className,
      )}
      {...props}
      ref={setItemNode}
      tabIndex={item.tabIndex}
      onFocus={item.onFocus}
      onKeyDown={item.onKeyDown}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        group.toggle(value);
      }}
    />
  );
};
ToggleGroupItem.displayName = 'ToggleGroupItem';

const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});

export { ToggleGroup };
export type {
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupProps,
  ToggleGroupSingleProps,
};
