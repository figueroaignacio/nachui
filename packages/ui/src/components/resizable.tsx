'use client';

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
  constraints: PanelConstraints[];
  panelIds: string[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  resizeAt: (handleIndex: number, delta: number) => void;
  resizeTo: (handleIndex: number, target: number) => void;
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

const ID_SEPARATOR = '\u001f';

function parseConstraints(key: string): PanelConstraints[] {
  if (!key) return [];
  return key.split('|').map((entry) => {
    const [defaultSize = '', minSize = '10', maxSize = '100'] = entry.split(':');
    return {
      defaultSize: defaultSize === '' ? undefined : Number(defaultSize),
      minSize: Number(minSize),
      maxSize: Number(maxSize),
    };
  });
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
  const baseId = React.useId();

  const childArray = React.Children.toArray(children);
  const isPanel = (child: React.ReactNode): child is React.ReactElement<ResizablePanelProps> =>
    React.isValidElement(child) && child.type === ResizablePanel;
  const panelPositions = childArray.flatMap((child, position) =>
    isPanel(child) ? [position] : [],
  );
  const panels = childArray.filter(isPanel);
  const items = childArray.map((child, position) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === ResizablePanel) {
      return (
        <PanelIndexContext key={child.key} value={panelPositions.indexOf(position)}>
          {child}
        </PanelIndexContext>
      );
    }

    if (child.type === ResizableHandle) {
      const panelsBefore = panelPositions.filter((panel) => panel < position).length;
      return (
        <HandleIndexContext key={child.key} value={panelsBefore - 1}>
          {child}
        </HandleIndexContext>
      );
    }

    return child;
  });

  const constraintsKey = panels
    .map((panel) =>
      [panel.props.defaultSize ?? '', panel.props.minSize ?? 10, panel.props.maxSize ?? 100].join(
        ':',
      ),
    )
    .join('|');
  const panelIdsKey = panels
    .map((panel, index) => panel.props.id ?? `${baseId}-panel-${index}`)
    .join(ID_SEPARATOR);
  const constraints = React.useMemo(() => parseConstraints(constraintsKey), [constraintsKey]);
  const panelIds = React.useMemo(
    () => (panelIdsKey ? panelIdsKey.split(ID_SEPARATOR) : []),
    [panelIdsKey],
  );

  const fallbackSizes = React.useMemo(
    () => initialSizes(parseConstraints(constraintsKey)),
    [constraintsKey],
  );
  const [sizes, setSizes] = React.useState<number[]>(fallbackSizes);
  const layout = sizes.length === fallbackSizes.length ? sizes : fallbackSizes;

  const onLayoutRef = React.useRef(onLayout);
  const constraintsRef = React.useRef(constraints);

  React.useLayoutEffect(() => {
    onLayoutRef.current = onLayout;
    constraintsRef.current = constraints;
  });

  const resizeBy = React.useCallback(
    (handleIndex: number, getDelta: (before: number) => number) => {
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
          return previous;
        }

        const maxGrow = Math.min(beforeRule.maxSize - before, after - afterRule.minSize);
        const maxShrink = Math.min(before - beforeRule.minSize, afterRule.maxSize - after);
        const applied = clamp(getDelta(before), -maxShrink, maxGrow);
        if (applied === 0) return previous;

        const next = [...current];
        next[handleIndex] = before + applied;
        next[handleIndex + 1] = after - applied;
        return next;
      });
    },
    [],
  );

  const resizeAt = React.useCallback(
    (handleIndex: number, delta: number) => resizeBy(handleIndex, () => delta),
    [resizeBy],
  );

  const resizeTo = React.useCallback(
    (handleIndex: number, target: number) => resizeBy(handleIndex, (before) => target - before),
    [resizeBy],
  );

  const initialSizesRef = React.useRef(sizes);
  React.useEffect(() => {
    if (sizes === initialSizesRef.current) return;
    onLayoutRef.current?.(sizes);
  }, [sizes]);

  const context = React.useMemo(
    () => ({
      direction,
      sizes: layout,
      constraints,
      panelIds,
      containerRef,
      resizeAt,
      resizeTo,
      setDragging,
    }),
    [direction, layout, constraints, panelIds, resizeAt, resizeTo],
  );

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
  id,
  ref,
  ...props
}: ResizablePanelProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { sizes, direction, panelIds } = useResizableContext();
  const index = React.use(PanelIndexContext);
  const size = sizes[index] ?? 0;

  return (
    <div
      ref={ref}
      id={id ?? panelIds[index]}
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
  label?: string;
}

const ResizableHandle = ({
  withHandle = false,
  disabled = false,
  step = 2,
  label = 'Resize panels',
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  ref,
  ...props
}: ResizableHandleProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { direction, sizes, constraints, panelIds, containerRef, resizeAt, resizeTo, setDragging } =
    useResizableContext();
  const index = React.use(HandleIndexContext);
  const dragRef = React.useRef<{
    start: number;
    before: number;
    total: number;
    pointer: number;
  } | null>(null);
  const frameRef = React.useRef(0);
  const [active, setActive] = React.useState(false);
  const isHorizontal = direction === 'horizontal';

  const before = sizes[index] ?? 0;
  const rule = constraints[index];

  const containerSize = () => {
    const container = containerRef.current;
    if (!container) return 0;
    return isHorizontal ? container.clientWidth : container.clientHeight;
  };

  React.useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const applyDrag = () => {
    frameRef.current = 0;
    const drag = dragRef.current;
    if (!drag || drag.total === 0) return;
    const deltaPercent = ((drag.pointer - drag.start) / drag.total) * 100;
    resizeTo(index, drag.before + deltaPercent);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (disabled || event.defaultPrevented || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const start = isHorizontal ? event.clientX : event.clientY;
    dragRef.current = { start, before, total: containerSize(), pointer: start };
    setDragging(true);
    setActive(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const drag = dragRef.current;
    if (!drag) return;
    drag.pointer = isHorizontal ? event.clientX : event.clientY;
    if (!frameRef.current) frameRef.current = requestAnimationFrame(applyDrag);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    if (!dragRef.current) return;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      applyDrag();
    }
    dragRef.current = null;
    setDragging(false);
    setActive(false);
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
      aria-label={label}
      aria-controls={panelIds[index]}
      aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(before)}
      aria-valuemin={rule ? Math.round(rule.minSize) : 0}
      aria-valuemax={rule ? Math.round(rule.maxSize) : 100}
      aria-disabled={disabled || undefined}
      data-slot="resizable-handle"
      data-direction={direction}
      data-disabled={disabled ? '' : undefined}
      data-active={active ? '' : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        'group/handle bg-border focus-visible:ring-ring ring-offset-background relative flex shrink-0 touch-none items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-offset-1 data-[disabled]:pointer-events-none',
        isHorizontal
          ? 'w-px cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 pointer-coarse:after:w-6'
          : 'h-px w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-2 after:-translate-y-1/2 pointer-coarse:after:h-6',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <span
          aria-hidden="true"
          className={cn(
            'bg-border-interactive/70 group-hover/handle:bg-foreground/85 group-data-[active]/handle:bg-foreground/85 group-focus-visible/handle:bg-ring z-10 shrink-0 rounded-full transition-[width,height,background-color] duration-200 motion-reduce:transition-none',
            isHorizontal
              ? 'h-7 w-[3px] group-hover/handle:h-11 group-data-[active]/handle:h-11'
              : 'h-[3px] w-7 group-hover/handle:w-11 group-data-[active]/handle:w-11',
          )}
        />
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
