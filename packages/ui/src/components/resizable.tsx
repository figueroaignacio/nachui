'use client';

import { DragDropVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

type ResizableDirection = 'horizontal' | 'vertical';

interface PanelConstraints {
  defaultSize?: number;
  minSize: number;
  maxSize: number;
}

interface ResizableContextValue {
  direction: ResizableDirection;
  sizes: number[];
  constraintsRef: React.RefObject<PanelConstraints[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  resizeAt: (handleIndex: number, delta: number) => void;
  setDragging: (dragging: boolean) => void;
}

const ResizableContext = React.createContext<ResizableContextValue | null>(null);
const PanelIndexContext = React.createContext<number>(-1);
const HandleIndexContext = React.createContext<number>(-1);

function useResizableContext(): ResizableContextValue {
  const context = React.use(ResizableContext);
  if (!context) throw new Error('Resizable parts must be used within Resizable');
  return context;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function initialSizes(constraints: PanelConstraints[]): number[] {
  const assigned = constraints.map((panel) => panel.defaultSize);
  const used = assigned.reduce<number>((total, size) => total + (size ?? 0), 0);
  const missing = assigned.filter((size) => size === undefined).length;
  const remainder = Math.max(100 - used, 0);
  const share = missing > 0 ? remainder / missing : 0;

  const sizes = assigned.map((size, index) => {
    const panel = constraints[index];
    const proposed = size ?? share;
    return panel ? clamp(proposed, panel.minSize, panel.maxSize) : proposed;
  });

  const total = sizes.reduce((sum, size) => sum + size, 0);
  return total > 0 ? sizes.map((size) => (size / total) * 100) : sizes;
}

interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResizableDirection;
  onLayout?: (sizes: number[]) => void;
}

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

const ResizableRoot = ({
  direction = 'horizontal',
  onLayout,
  className,
  children,
  ref,
  ...props
}: ResizableProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const constraints: PanelConstraints[] = [];
  let panelCount = 0;

  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === ResizablePanel) {
      const panelProps = child.props as ResizablePanelProps;
      constraints.push({
        defaultSize: panelProps.defaultSize,
        minSize: panelProps.minSize ?? 10,
        maxSize: panelProps.maxSize ?? 100,
      });
      const index = panelCount;
      panelCount += 1;
      return <PanelIndexContext value={index}>{child}</PanelIndexContext>;
    }

    if (child.type === ResizableHandle) {
      return <HandleIndexContext value={panelCount - 1}>{child}</HandleIndexContext>;
    }

    return child;
  });

  const [sizes, setSizes] = React.useState<number[]>(() => initialSizes(constraints));
  const layout = sizes.length === constraints.length ? sizes : initialSizes(constraints);

  const onLayoutRef = React.useRef(onLayout);
  onLayoutRef.current = onLayout;

  const constraintsRef = React.useRef(constraints);
  constraintsRef.current = constraints;

  const resizeAt = React.useCallback((handleIndex: number, delta: number) => {
    setSizes((previous) => {
      const current =
        previous.length === constraintsRef.current.length
          ? previous
          : initialSizes(constraintsRef.current);
      const before = current[handleIndex];
      const after = current[handleIndex + 1];
      const beforeRule = constraintsRef.current[handleIndex];
      const afterRule = constraintsRef.current[handleIndex + 1];
      if (before === undefined || after === undefined || !beforeRule || !afterRule) {
        return current;
      }

      const maxGrow = Math.min(beforeRule.maxSize - before, after - afterRule.minSize);
      const maxShrink = Math.min(before - beforeRule.minSize, afterRule.maxSize - after);
      const applied = clamp(delta, -maxShrink, maxGrow);
      if (applied === 0) return current;

      const next = [...current];
      next[handleIndex] = before + applied;
      next[handleIndex + 1] = after - applied;
      onLayoutRef.current?.(next);
      return next;
    });
  }, []);

  const context = { direction, sizes: layout, constraintsRef, containerRef, resizeAt, setDragging };

  return (
    <ResizableContext value={context}>
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="resizable"
        data-direction={direction}
        data-dragging={dragging ? '' : undefined}
        className={cn(
          'flex size-full data-[direction=vertical]:flex-col data-[dragging]:select-none',
          className,
        )}
        {...props}
      >
        {items}
      </div>
    </ResizableContext>
  );
};
ResizableRoot.displayName = 'Resizable';

const ResizablePanel = ({
  defaultSize: _defaultSize,
  minSize: _minSize,
  maxSize: _maxSize,
  className,
  style,
  ref,
  ...props
}: ResizablePanelProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { sizes, direction } = useResizableContext();
  const index = React.use(PanelIndexContext);
  const size = sizes[index] ?? 0;

  return (
    <div
      ref={ref}
      data-slot="resizable-panel"
      data-direction={direction}
      style={{ flex: `${size} 1 0px`, ...style }}
      className={cn('min-h-0 min-w-0 overflow-hidden', className)}
      {...props}
    />
  );
};
ResizablePanel.displayName = 'ResizablePanel';

interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean;
  disabled?: boolean;
  step?: number;
}

const ResizableHandle = ({
  withHandle = false,
  disabled = false,
  step = 2,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  ref,
  ...props
}: ResizableHandleProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { direction, sizes, constraintsRef, containerRef, resizeAt, setDragging } =
    useResizableContext();
  const index = React.use(HandleIndexContext);
  const dragRef = React.useRef<{ start: number; before: number; after: number } | null>(null);
  const isHorizontal = direction === 'horizontal';

  const before = sizes[index] ?? 0;
  const rule = constraintsRef.current[index];

  const containerSize = () => {
    const container = containerRef.current;
    if (!container) return 0;
    return isHorizontal ? container.clientWidth : container.clientHeight;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (disabled || event.defaultPrevented || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      start: isHorizontal ? event.clientX : event.clientY,
      before,
      after: sizes[index + 1] ?? 0,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const drag = dragRef.current;
    if (!drag) return;
    const total = containerSize();
    if (total === 0) return;
    const current = isHorizontal ? event.clientX : event.clientY;
    const deltaPercent = ((current - drag.start) / total) * 100;
    const target = drag.before + deltaPercent;
    resizeAt(index, target - before);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (disabled || event.defaultPrevented) return;
    const grow = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const shrink = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const amount = event.shiftKey ? step * 5 : step;

    if (event.key === grow) {
      event.preventDefault();
      resizeAt(index, amount);
    } else if (event.key === shrink) {
      event.preventDefault();
      resizeAt(index, -amount);
    } else if (event.key === 'Home') {
      event.preventDefault();
      resizeAt(index, -100);
    } else if (event.key === 'End') {
      event.preventDefault();
      resizeAt(index, 100);
    }
  };

  return (
    <div
      ref={ref}
      role="separator"
      tabIndex={disabled ? -1 : 0}
      aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(before)}
      aria-valuemin={rule ? Math.round(rule.minSize) : 0}
      aria-valuemax={rule ? Math.round(rule.maxSize) : 100}
      aria-disabled={disabled || undefined}
      data-slot="resizable-handle"
      data-direction={direction}
      data-disabled={disabled ? '' : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        'bg-border focus-visible:ring-ring relative flex shrink-0 touch-none items-center justify-center outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[disabled]:pointer-events-none',
        isHorizontal
          ? 'w-px cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2'
          : 'h-px w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-2 after:-translate-y-1/2',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <span
          aria-hidden="true"
          className={cn(
            'bg-border text-muted-foreground z-10 flex items-center justify-center rounded-sm border',
            isHorizontal ? 'h-6 w-3.5' : 'h-3.5 w-6 rotate-90',
          )}
        >
          <HugeiconsIcon icon={DragDropVerticalIcon} size={12} className="size-3" />
        </span>
      )}
    </div>
  );
};
ResizableHandle.displayName = 'ResizableHandle';

const Resizable = Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});

export { Resizable, useResizableContext };
export type { ResizableProps, ResizablePanelProps, ResizableHandleProps, ResizableDirection };
