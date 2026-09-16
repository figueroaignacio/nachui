'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from 'motion/react';
import * as React from 'react';
import { cn } from '../lib/cn';
import { Tooltip } from './tooltip';

type DockContextValue = {
  mouseX: MotionValue<number>;
  magnify: boolean;
  itemSize: number;
  magnifiedSize: number;
  range: number;
};

const DockContext = React.createContext<DockContextValue | null>(null);

const useDockContext = () => {
  const context = React.use(DockContext);
  if (!context) throw new Error('Dock.Item must be used inside <Dock>.');
  return context;
};

interface DockProps extends HTMLMotionProps<'nav'> {
  hidden?: boolean;
  floating?: boolean;
  magnify?: boolean;
  itemSize?: number;
  magnifiedSize?: number;
  range?: number;
  label?: string;
}

const BAR_TRANSITION = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.7 };

const DockRoot = ({
  hidden = false,
  floating = true,
  magnify = true,
  itemSize = 40,
  magnifiedSize = 60,
  range = 120,
  label = 'Dock',
  className,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: DockProps) => {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(Infinity);

  const context = React.useMemo(
    () => ({ mouseX, magnify: magnify && !reduceMotion, itemSize, magnifiedSize, range }),
    [mouseX, magnify, reduceMotion, itemSize, magnifiedSize, range],
  );

  const bar = (
    <DockContext value={context}>
      <motion.nav
        aria-label={label}
        data-hidden={hidden ? 'true' : undefined}
        initial={false}
        animate={hidden ? { y: 96, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : BAR_TRANSITION}
        onMouseMove={(event) => {
          mouseX.set(event.clientX);
          onMouseMove?.(event);
        }}
        onMouseLeave={(event) => {
          mouseX.set(Infinity);
          onMouseLeave?.(event);
        }}
        style={{ height: itemSize + 12 }}
        className={cn(
          'border-border/60 bg-background/80 text-foreground flex items-end gap-1 rounded-full border px-1.5 pb-1.5 shadow-lg backdrop-blur-md',
          hidden && 'pointer-events-none',
          className,
        )}
        {...props}
      >
        {children}
      </motion.nav>
    </DockContext>
  );

  if (!floating) return bar;

  return <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">{bar}</div>;
};
DockRoot.displayName = 'Dock';

interface DockItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  asChild?: boolean;
  containerClassName?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

const DockItem = ({
  label,
  active,
  asChild,
  className,
  containerClassName,
  children,
  ref,
  ...props
}: DockItemProps) => {
  const { mouseX, magnify, itemSize, magnifiedSize, range } = useDockContext();
  const containerRef = React.useRef<HTMLSpanElement>(null);

  const distance = useTransform(mouseX, (x) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds || !magnify) return Infinity;
    return x - (bounds.left + bounds.width / 2);
  });
  const targetSize = useTransform(
    distance,
    [-range, 0, range],
    [itemSize, magnifiedSize, itemSize],
  );
  const size = useSpring(targetSize, { mass: 0.1, stiffness: 170, damping: 14 });

  const classes = cn(
    'text-muted-foreground hover:text-foreground focus-visible:ring-ring data-[active=true]:text-foreground relative flex size-full cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none [&_svg]:size-[46%] [&_svg]:shrink-0',
    "data-[active=true]:after:bg-foreground after:absolute after:bottom-0.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:opacity-0 after:transition-opacity after:content-[''] data-[active=true]:after:opacity-100",
    className,
  );

  const control =
    asChild && React.isValidElement(children) ? (
      React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ...props,
        className: cn(
          classes,
          (children as React.ReactElement<Record<string, unknown>>).props.className as
            | string
            | undefined,
        ),
        'aria-label': label,
        'aria-current': active ? 'page' : undefined,
        'data-active': active ? 'true' : undefined,
      })
    ) : (
      <button
        type="button"
        ref={ref}
        aria-label={label}
        aria-pressed={active}
        data-active={active ? 'true' : undefined}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );

  return (
    <Tooltip delayDuration={80}>
      <Tooltip.Trigger asChild>
        <motion.span
          ref={containerRef}
          style={{ width: size, height: size }}
          whileTap={{ scale: 0.86 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'hover:bg-muted data-[active=true]:bg-muted/70 relative flex shrink-0 items-center justify-center rounded-full transition-colors',
            containerClassName,
          )}
          data-active={active ? 'true' : undefined}
        >
          {control}
        </motion.span>
      </Tooltip.Trigger>
      <Tooltip.Content side="top" sideOffset={8}>
        {label}
      </Tooltip.Content>
    </Tooltip>
  );
};
DockItem.displayName = 'DockItem';

const DockSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="separator"
    aria-orientation="vertical"
    className={cn('bg-border mx-1 mb-2 h-6 w-px shrink-0 self-center', className)}
    {...props}
  />
);
DockSeparator.displayName = 'DockSeparator';

interface DockAutoHideOptions {
  threshold?: number;
  revealZone?: number;
  minScroll?: number;
}

function useDockAutoHide({
  threshold = 12,
  revealZone = 96,
  minScroll = 80,
}: DockAutoHideOptions = {}) {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 2;
        if (Math.abs(delta) < threshold) return;
        setHidden(delta > 0 && y > minScroll && !atBottom);
        last = y;
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      if (window.innerHeight - event.clientY < revealZone) setHidden(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold, revealZone, minScroll]);

  return hidden;
}

const Dock = Object.assign(DockRoot, {
  Item: DockItem,
  Separator: DockSeparator,
});

export { Dock, useDockAutoHide };
export type { DockProps, DockItemProps, DockAutoHideOptions };
