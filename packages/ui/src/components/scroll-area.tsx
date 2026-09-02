'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

type ScrollAreaType = 'auto' | 'always' | 'hover' | 'scroll';
type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
type ScrollBarOrientation = 'vertical' | 'horizontal';

interface ScrollAreaContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  type: ScrollAreaType;
  scrollHideDelay: number;
  hovering: boolean;
  scrolling: boolean;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue | null>(null);

function useScrollAreaContext(): ScrollAreaContextValue {
  const context = React.use(ScrollAreaContext);
  if (!context) throw new Error('ScrollArea parts must be used within ScrollArea');
  return context;
}

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ScrollAreaType;
  orientation?: ScrollAreaOrientation;
  scrollHideDelay?: number;
  viewportRef?: React.Ref<HTMLDivElement>;
  viewportClassName?: string;
}

const MIN_THUMB_SIZE = 18;

const ScrollAreaRoot = ({
  type = 'hover',
  orientation = 'vertical',
  scrollHideDelay = 600,
  viewportRef: externalViewportRef,
  viewportClassName,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  ref,
  ...props
}: ScrollAreaProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = React.useState(false);
  const [scrolling, setScrolling] = React.useState(false);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const mergedViewportRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      if (typeof externalViewportRef === 'function') externalViewportRef(node);
      else if (externalViewportRef) {
        (externalViewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [externalViewportRef],
  );

  const handleScroll = React.useCallback(() => {
    setScrolling(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setScrolling(false), scrollHideDelay);
  }, [scrollHideDelay]);

  React.useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const context = React.useMemo(
    () => ({ viewportRef, type, scrollHideDelay, hovering, scrolling }),
    [type, scrollHideDelay, hovering, scrolling],
  );

  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <ScrollAreaContext value={context}>
      <div
        ref={ref}
        data-slot="scroll-area"
        data-orientation={orientation}
        className={cn('relative overflow-hidden', className)}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          setHovering(true);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHovering(false);
        }}
        {...props}
      >
        <div
          ref={mergedViewportRef}
          data-slot="scroll-area-viewport"
          onScroll={handleScroll}
          className={cn(
            'size-full [scrollbar-width:none] rounded-[inherit] [&::-webkit-scrollbar]:hidden',
            showVertical ? 'overflow-y-auto' : 'overflow-y-hidden',
            showHorizontal ? 'overflow-x-auto' : 'overflow-x-hidden',
            viewportClassName,
          )}
        >
          {children}
        </div>
        {showVertical && <ScrollAreaBar orientation="vertical" />}
        {showHorizontal && <ScrollAreaBar orientation="horizontal" />}
      </div>
    </ScrollAreaContext>
  );
};
ScrollAreaRoot.displayName = 'ScrollArea';

interface ScrollAreaBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollBarOrientation;
  forceMount?: boolean;
}

interface ThumbMetrics {
  overflow: boolean;
  size: number;
  offset: number;
}

const ScrollAreaBar = ({
  orientation = 'vertical',
  forceMount = false,
  className,
  ref,
  ...props
}: ScrollAreaBarProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { viewportRef, type, hovering, scrolling } = useScrollAreaContext();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ start: number; scroll: number } | null>(null);
  const [metrics, setMetrics] = React.useState<ThumbMetrics>({
    overflow: false,
    size: 0,
    offset: 0,
  });
  const [dragging, setDragging] = React.useState(false);
  const isVertical = orientation === 'vertical';

  const measure = React.useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
    const clientSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
    const scrollPosition = isVertical ? viewport.scrollTop : viewport.scrollLeft;
    const trackSize = isVertical ? track.clientHeight : track.clientWidth;
    const overflow = scrollSize > clientSize + 1;

    if (!overflow || trackSize === 0) {
      setMetrics((previous) =>
        previous.overflow ? { overflow: false, size: 0, offset: 0 } : previous,
      );
      return;
    }

    const size = Math.max(Math.round((clientSize / scrollSize) * trackSize), MIN_THUMB_SIZE);
    const maxScroll = scrollSize - clientSize;
    const offset = Math.round((scrollPosition / maxScroll) * (trackSize - size));

    setMetrics((previous) =>
      previous.overflow && previous.size === size && previous.offset === offset
        ? previous
        : { overflow: true, size, offset },
    );
  }, [isVertical, viewportRef]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    measure();
    viewport.addEventListener('scroll', measure, { passive: true });

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(viewport);
      for (const child of Array.from(viewport.children)) observer.observe(child);
    }

    return () => {
      viewport.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [measure, viewportRef]);

  const scrollTo = (position: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (isVertical) viewport.scrollTop = position;
    else viewport.scrollLeft = position;
  };

  const scrollRatio = () => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return 0;
    const scrollSize = isVertical ? viewport.scrollHeight : viewport.scrollWidth;
    const clientSize = isVertical ? viewport.clientHeight : viewport.clientWidth;
    const trackSize = isVertical ? track.clientHeight : track.clientWidth;
    const travel = trackSize - metrics.size;
    return travel > 0 ? (scrollSize - clientSize) / travel : 0;
  };

  const handleThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const viewport = viewportRef.current;
    if (!viewport) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      start: isVertical ? event.clientY : event.clientX,
      scroll: isVertical ? viewport.scrollTop : viewport.scrollLeft,
    };
    setDragging(true);
  };

  const handleThumbPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const current = isVertical ? event.clientY : event.clientX;
    scrollTo(drag.scroll + (current - drag.start) * scrollRatio());
  };

  const handleThumbPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const position = isVertical ? event.clientY - rect.top : event.clientX - rect.left;
    scrollTo((position - metrics.size / 2) * scrollRatio());
  };

  const visible =
    forceMount ||
    (metrics.overflow &&
      (type === 'always' ||
        type === 'auto' ||
        dragging ||
        (type === 'hover' && (hovering || scrolling)) ||
        (type === 'scroll' && scrolling)));

  const thumbStyle = isVertical
    ? { height: metrics.size, transform: `translateY(${metrics.offset}px)` }
    : { width: metrics.size, transform: `translateX(${metrics.offset}px)` };

  return (
    <div
      ref={(node) => {
        trackRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      data-state={visible ? 'visible' : 'hidden'}
      aria-hidden="true"
      onPointerDown={handleTrackPointerDown}
      className={cn(
        'absolute flex touch-none transition-opacity duration-150 select-none data-[state=hidden]:pointer-events-none data-[state=hidden]:opacity-0',
        isVertical
          ? 'top-0 right-0 h-full w-2.5 border-l border-l-transparent p-px'
          : 'bottom-0 left-0 h-2.5 w-full flex-col border-t border-t-transparent p-px',
        className,
      )}
      {...props}
    >
      <div
        data-slot="scroll-area-thumb"
        data-dragging={dragging ? '' : undefined}
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        onPointerUp={handleThumbPointerUp}
        onPointerCancel={handleThumbPointerUp}
        style={thumbStyle}
        className={cn(
          'bg-border hover:bg-muted-foreground/50 data-[dragging]:bg-muted-foreground/60 relative rounded-full transition-colors',
          isVertical ? 'w-full' : 'h-full',
        )}
      />
    </div>
  );
};
ScrollAreaBar.displayName = 'ScrollAreaBar';

const ScrollArea = Object.assign(ScrollAreaRoot, {
  Bar: ScrollAreaBar,
});

export { ScrollArea, useScrollAreaContext };
export type { ScrollAreaProps, ScrollAreaBarProps, ScrollAreaType, ScrollAreaOrientation };
