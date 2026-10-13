'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { DEMO_COMPONENTS } from '@/components/mdx/demo-registry';
import type { DocItem } from '@/lib/definitions';
import { cn } from '@repo/ui/lib/cn';
import { floatingOrigin, floatingVariants, reveal, springs, still } from '@repo/ui/lib/motion';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import type { SidebarPreview as SidebarPreviewData } from '../lib/sidebar-previews';

const CARD_WIDTH = 340;
/** Close enough to the real height to keep the card inside the viewport. */
const CARD_HEIGHT = 290;
const GAP = 12;
const EDGE = 16;
/** Room kept at the bottom for the floating site dock. */
const DOCK_CLEARANCE = 96;
const STAGE_WIDTH = 560;
const FRAME_HEIGHT = 180;
const FRAME_PADDING = 24;
const MAX_SCALE = 0.75;

const loadedDemos = new Map<string, React.ComponentType>();

type DemoState =
  | { status: 'loading' }
  | { status: 'ready'; Demo: React.ComponentType }
  | { status: 'failed' };

interface LoadResult {
  key: string;
  state: DemoState;
}

function useDemo(component: string, demo: string): DemoState {
  const key = `${component}/${demo}`;
  const [result, setResult] = React.useState<LoadResult | null>(null);

  React.useEffect(() => {
    const load = DEMO_COMPONENTS[component]?.[demo];
    if (!load || loadedDemos.has(key)) return;
    let alive = true;
    const settle = (state: DemoState) => {
      if (alive) setResult({ key, state });
    };
    load()
      .then((loaded) => {
        loadedDemos.set(key, loaded);
        settle({ status: 'ready', Demo: loaded });
      })
      .catch((error: unknown) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`Failed to load the ${key} demo for the sidebar preview`, error);
        }
        settle({ status: 'failed' });
      });
    return () => {
      alive = false;
    };
  }, [key, component, demo]);

  const cached = loadedDemos.get(key);
  if (cached) return { status: 'ready', Demo: cached };
  if (!DEMO_COMPONENTS[component]?.[demo]) return { status: 'failed' };
  if (result?.key === key) return result.state;
  return { status: 'loading' };
}

/**
 * Renders the demo at docs width and scales it to fill the preview frame, so a
 * small button and a full chat both read well. Capped so nothing looks blown up.
 */
function FittedDemo({ Demo }: { Demo: React.ComponentType }) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.5);

  React.useLayoutEffect(() => {
    const content = contentRef.current?.firstElementChild as HTMLElement | null;
    if (!content) return;
    const fit = () => {
      const width = content.offsetWidth || STAGE_WIDTH;
      const height = content.offsetHeight || FRAME_HEIGHT;
      setScale(
        Math.min(
          MAX_SCALE,
          (CARD_WIDTH - FRAME_PADDING * 2) / width,
          (FRAME_HEIGHT - FRAME_PADDING) / height,
        ),
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 flex items-center justify-center"
      style={{ width: STAGE_WIDTH, transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      <div ref={contentRef} className="flex max-w-full justify-center">
        <DemoBoundary>
          <Demo />
        </DemoBoundary>
      </div>
    </div>
  );
}

class DemoBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface SidebarPreviewProps {
  preview: SidebarPreviewData;
  badge?: DocItem['badge'];
  /** The hovered link's box; the card sits to the right of `edge`. */
  anchor: DOMRect;
  edge: number;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

/**
 * A hover card for the docs sidebar: the first live demo of the hovered page,
 * scaled down, with its name and description. It lives outside the sidebar's
 * scroll container (which would clip it) and follows the pointer between items.
 */
export function SidebarPreview({
  preview,
  badge,
  anchor,
  edge,
  onPointerEnter,
  onPointerLeave,
}: SidebarPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const demoState = useDemo(preview.component, preview.demo);

  const top = Math.min(
    Math.max(anchor.top + anchor.height / 2 - CARD_HEIGHT / 2, EDGE),
    window.innerHeight - CARD_HEIGHT - DOCK_CLEARANCE,
  );

  return (
    <motion.div
      aria-hidden="true"
      className="fixed z-50"
      style={{ left: edge + GAP, top: 0, width: CARD_WIDTH }}
      initial={{ y: top }}
      animate={{ y: top }}
      transition={shouldReduceMotion ? still : springs.smooth}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        data-no-select
        variants={shouldReduceMotion ? reveal : floatingVariants.right}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          'bg-popover text-popover-foreground border-border overflow-hidden rounded-md border shadow-md',
          floatingOrigin.right,
        )}
      >
        <div
          inert
          className="bg-surface-muted border-border relative h-[180px] overflow-hidden border-b"
        >
          {demoState.status === 'ready' && <FittedDemo Demo={demoState.Demo} />}
          {demoState.status === 'loading' && (
            <div className="bg-muted/60 absolute inset-6 animate-pulse rounded-md motion-reduce:animate-none" />
          )}
          {demoState.status === 'failed' && (
            <div className="bg-muted/40 absolute inset-6 rounded-md" />
          )}
        </div>
        <div className="flex flex-col gap-1 px-4 pt-3 pb-3.5">
          <span className="flex items-center gap-2 text-sm font-medium">
            {preview.title}
            <NavBadge badge={badge} />
          </span>
          {preview.description && (
            <span className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {preview.description}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
