import * as React from 'react';
import { vi } from 'vitest';

const MOTION_PROPS = new Set([
  'animate',
  'custom',
  'drag',
  'dragConstraints',
  'dragControls',
  'dragElastic',
  'dragListener',
  'dragMomentum',
  'dragSnapToOrigin',
  'exit',
  'initial',
  'inherit',
  'layout',
  'layoutDependency',
  'layoutId',
  'onAnimationComplete',
  'onAnimationStart',
  'onDrag',
  'onDragEnd',
  'onDragStart',
  'onUpdate',
  'transition',
  'variants',
  'whileDrag',
  'whileFocus',
  'whileHover',
  'whileInView',
  'whileTap',
]);

type MotionValueLike = { get: () => unknown };

function isMotionValue(value: unknown): value is MotionValueLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'get' in value &&
    typeof (value as MotionValueLike).get === 'function'
  );
}

function toStyle(style: unknown): React.CSSProperties | undefined {
  if (!style || typeof style !== 'object') return undefined;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(style)) {
    result[key] = isMotionValue(value) ? value.get() : value;
  }
  return result as React.CSSProperties;
}

function stripMotionProps(props: Record<string, unknown>) {
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (MOTION_PROPS.has(key)) continue;
    rest[key] = key === 'style' ? toStyle(value) : value;
  }
  return rest;
}

const cache = new Map<string, React.FC<Record<string, unknown>>>();

function createMotionComponent(tag: string) {
  const cached = cache.get(tag);
  if (cached) return cached;
  const Component: React.FC<Record<string, unknown>> = (props) =>
    React.createElement(tag, stripMotionProps(props));
  Component.displayName = `motion.${tag}`;
  cache.set(tag, Component);
  return Component;
}

export const motion = new Proxy(
  {},
  {
    get: (_target, tag: string) => createMotionComponent(tag),
  },
) as Record<string, React.FC<Record<string, unknown>>>;

export const AnimatePresence = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export const useReducedMotion = () => false;

type MockMotionValue<T> = { get: () => T; set: (next: T) => void; on: () => () => void };

function createMotionValue<T>(initial: T): MockMotionValue<T> {
  let current = initial;
  return {
    get: () => current,
    set: (next: T) => {
      current = next;
    },
    on: () => () => {},
  };
}

export const useMotionValue = <T,>(initial: T) =>
  React.useState(() => createMotionValue(initial))[0];

export const useSpring = <T,>(source: T) =>
  isMotionValue(source) ? source : createMotionValue(source);

export const useTransform = () => createMotionValue(0);

export const useDragControls = (): { start: (event: unknown) => void } => ({ start: vi.fn() });
