'use client';

import { DEMO_COMPONENTS } from '@/components/mdx/demo-registry';
import * as React from 'react';

const loadedDemos = new Map<string, React.ComponentType>();

export type DemoState =
  | { status: 'loading' }
  | { status: 'ready'; Demo: React.ComponentType }
  | { status: 'failed' };

interface LoadResult {
  key: string;
  state: DemoState;
}

/**
 * Loads one demo from the generated registry on the client and keeps it for the
 * rest of the session, so a demo shown in two places is fetched once. Pass
 * `enabled: false` to hold the request until the demo is about to be seen.
 */
export function useDemo(component: string, demo: string, enabled = true): DemoState {
  const key = `${component}/${demo}`;
  const [result, setResult] = React.useState<LoadResult | null>(null);

  React.useEffect(() => {
    const load = DEMO_COMPONENTS[component]?.[demo];
    if (!enabled || !load || loadedDemos.has(key)) return;
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
          console.error(`Failed to load the ${key} demo`, error);
        }
        settle({ status: 'failed' });
      });
    return () => {
      alive = false;
    };
  }, [key, component, demo, enabled]);

  const cached = loadedDemos.get(key);
  if (cached) return { status: 'ready', Demo: cached };
  if (!DEMO_COMPONENTS[component]?.[demo]) return { status: 'failed' };
  if (result?.key === key) return result.state;
  return { status: 'loading' };
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

interface FittedDemoProps {
  Demo: React.ComponentType;
  /** Width the demo is laid out at before scaling, close to the docs column. */
  stageWidth?: number;
  /** Never blow a small demo up past this. */
  maxScale?: number;
  /** Air kept between the demo and the frame, in px. */
  padding?: number;
}

/**
 * Renders a demo at docs width and scales it to fill the nearest positioned
 * ancestor, so a small button and a full chat both read well in the same frame.
 * The demo is a picture here: the caller marks the frame `inert`.
 */
export function FittedDemo({
  Demo,
  stageWidth = 560,
  maxScale = 0.75,
  padding = 24,
}: FittedDemoProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.5);

  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current?.firstElementChild as HTMLElement | null;
    if (!frame || !content) return;
    const fit = () => {
      const width = content.offsetWidth || stageWidth;
      const height = content.offsetHeight || frame.clientHeight;
      setScale(
        Math.min(
          maxScale,
          (frame.clientWidth - padding * 2) / width,
          (frame.clientHeight - padding) / height,
        ),
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(content);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [stageWidth, maxScale, padding]);

  return (
    <div ref={frameRef} className="pointer-events-none absolute inset-0">
      <div
        className="absolute top-1/2 left-1/2 flex items-center justify-center"
        style={{ width: stageWidth, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <div ref={contentRef} className="flex max-w-full justify-center">
          <DemoBoundary>
            <Demo />
          </DemoBoundary>
        </div>
      </div>
    </div>
  );
}
