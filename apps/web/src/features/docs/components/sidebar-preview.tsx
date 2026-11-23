'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { FittedDemo, useDemo } from '@/components/common/live-demo';
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
/** Room kept between the card and the bottom of the viewport. */
const VIEWPORT_CLEARANCE = 24;

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
    window.innerHeight - CARD_HEIGHT - VIEWPORT_CLEARANCE,
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
          'bg-popover text-popover-foreground overflow-hidden rounded-md shadow-md',
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
