'use client';

import * as React from 'react';
import { cloneElement } from 'react';
import { cn } from '../lib/cn';
import type { Direction } from '../lib/direction';
import {
  RovingFocusContext,
  useComposedRef,
  useRovingFocusGroup,
  useRovingFocusItem,
} from '../lib/roving-focus';
import { Toggle, type ToggleProps } from './toggle';

type ToolbarOrientation = 'horizontal' | 'vertical';

const toolbarControlClassName =
  'inline-flex h-8 min-w-8 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 text-sm font-medium text-foreground outline-none select-none transition-colors ring-offset-background hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4';

type SlotChildProps = Record<string, unknown> & { ref?: React.Ref<HTMLElement> };

function mergeSlotProps(own: Record<string, unknown>, child: SlotChildProps) {
  const merged: Record<string, unknown> = { ...own, ...child };
  for (const [key, ownValue] of Object.entries(own)) {
    const childValue = child[key];
    if (
      /^on[A-Z]/.test(key) &&
      typeof ownValue === 'function' &&
      typeof childValue === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        childValue(...args);
        ownValue(...args);
      };
    }
  }
  if (own.className || child.className) {
    merged.className = cn(
      own.className as string | undefined,
      child.className as string | undefined,
    );
  }
  if (own.style || child.style) {
    merged.style = { ...(own.style as object | undefined), ...(child.style as object | undefined) };
  }
  return merged;
}

interface ToolbarContextValue {
  orientation: ToolbarOrientation;
}

const ToolbarContext = React.createContext<ToolbarContextValue>({ orientation: 'horizontal' });

interface ToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'dir'> {
  orientation?: ToolbarOrientation;
  dir?: Direction;
  loop?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const ToolbarRoot = ({
  orientation = 'horizontal',
  dir,
  loop = true,
  className,
  children,
  ref,
  ...props
}: ToolbarProps) => {
  const roving = useRovingFocusGroup<HTMLDivElement>({ orientation, dir, loop });
  const setToolbarNode = useComposedRef<HTMLDivElement>(roving.setRoot, ref);
  const contextValue = React.useMemo(() => ({ orientation }), [orientation]);

  return (
    <ToolbarContext value={contextValue}>
      <RovingFocusContext value={roving.scope}>
        <div
          ref={setToolbarNode}
          role="toolbar"
          aria-orientation={orientation}
          dir={dir}
          data-slot="toolbar"
          data-orientation={orientation}
          className={cn(
            'border-border bg-card flex gap-1 rounded-lg border p-1',
            orientation === 'horizontal' ? 'flex-row items-center' : 'w-fit flex-col items-stretch',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </RovingFocusContext>
    </ToolbarContext>
  );
};
ToolbarRoot.displayName = 'Toolbar';

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}

const ToolbarButton = ({
  className,
  disabled,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: ToolbarButtonProps) => {
  const item = useRovingFocusItem<HTMLButtonElement>({ disabled, onFocus, onKeyDown });
  const setNode = useComposedRef(item.setNode, ref);

  return (
    <button
      type="button"
      data-slot="toolbar-button"
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      className={cn(toolbarControlClassName, className)}
      {...props}
      ref={setNode}
      tabIndex={item.tabIndex}
      onFocus={item.onFocus}
      onKeyDown={item.onKeyDown}
    />
  );
};
ToolbarButton.displayName = 'ToolbarButton';

interface ToolbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: React.Ref<HTMLAnchorElement>;
}

const ToolbarLink = ({
  className,
  href,
  children,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: ToolbarLinkProps) => {
  const item = useRovingFocusItem<HTMLAnchorElement>({ onFocus, onKeyDown });
  const setNode = useComposedRef(item.setNode, ref);

  return (
    <a
      href={href}
      data-slot="toolbar-link"
      className={cn(
        toolbarControlClassName,
        'text-muted-foreground hover:text-foreground underline-offset-4',
        className,
      )}
      {...props}
      ref={setNode}
      tabIndex={item.tabIndex}
      onFocus={item.onFocus}
      onKeyDown={item.onKeyDown}
    >
      {children}
    </a>
  );
};
ToolbarLink.displayName = 'ToolbarLink';

const ToolbarToggle = ({
  disabled,
  onFocus,
  onKeyDown,
  ref,
  size = 'sm',
  ...props
}: ToggleProps) => {
  const item = useRovingFocusItem<HTMLButtonElement>({
    disabled: Boolean(disabled),
    onFocus,
    onKeyDown,
  });
  const setNode = useComposedRef(item.setNode, ref);

  return (
    <Toggle
      data-slot="toolbar-toggle"
      size={size}
      disabled={disabled}
      {...props}
      ref={setNode}
      tabIndex={item.tabIndex}
      onFocus={item.onFocus}
      onKeyDown={item.onKeyDown}
    />
  );
};
ToolbarToggle.displayName = 'ToolbarToggle';

interface ToolbarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

const ToolbarItem = ({
  asChild,
  className,
  disabled,
  onFocus,
  onKeyDown,
  children,
  ref,
  ...props
}: ToolbarItemProps) => {
  const slot = asChild && React.isValidElement<SlotChildProps>(children) ? children : null;
  const slotDisabled = slot ? Boolean(slot.props.disabled) : false;
  const item = useRovingFocusItem<HTMLButtonElement>({
    disabled: Boolean(disabled) || slotDisabled,
    onFocus,
    onKeyDown,
  });
  const setNode = useComposedRef(item.setNode, ref);
  const setSlotNode = useComposedRef(setNode, slot?.props.ref as React.Ref<HTMLButtonElement>);

  if (slot) {
    return cloneElement(slot, {
      ...mergeSlotProps(
        { ...props, className, onFocus: item.onFocus, onKeyDown: item.onKeyDown },
        slot.props,
      ),
      tabIndex: item.tabIndex,
      ref: setSlotNode,
    });
  }

  return (
    <button
      type="button"
      data-slot="toolbar-item"
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      className={cn(toolbarControlClassName, className)}
      {...props}
      ref={setNode}
      tabIndex={item.tabIndex}
      onFocus={item.onFocus}
      onKeyDown={item.onKeyDown}
    >
      {children}
    </button>
  );
};
ToolbarItem.displayName = 'ToolbarItem';

interface ToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

const ToolbarSeparator = ({ className, ref, ...props }: ToolbarSeparatorProps) => {
  const { orientation } = React.use(ToolbarContext);
  const separatorOrientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={separatorOrientation}
      data-slot="toolbar-separator"
      data-orientation={separatorOrientation}
      className={cn(
        'bg-border shrink-0 self-stretch',
        separatorOrientation === 'vertical' ? 'my-1 w-px' : 'mx-1 h-px',
        className,
      )}
      {...props}
    />
  );
};
ToolbarSeparator.displayName = 'ToolbarSeparator';

const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Link: ToolbarLink,
  Toggle: ToolbarToggle,
  Item: ToolbarItem,
  Separator: ToolbarSeparator,
});

export { Toolbar };
export type {
  ToolbarButtonProps,
  ToolbarItemProps,
  ToolbarLinkProps,
  ToolbarProps,
  ToolbarSeparatorProps,
};
