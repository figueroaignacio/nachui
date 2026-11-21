import './preview.css';

import type { Decorator, Preview } from '@storybook/react-vite';
import * as React from 'react';

import { PLAYBACK_EVENT } from '@repo/ui/lib/use-playback';

function PlaybackStage({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [target, setTarget] = React.useState<Element | null>(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const sync = () => {
      const element = container.querySelector('[data-playback]');
      setTarget(element);
      setPlaying(element?.getAttribute('data-playback') === 'playing');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-playback'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
      {target ? (
        <button
          type="button"
          disabled={playing}
          onClick={() => target.dispatchEvent(new CustomEvent(PLAYBACK_EVENT))}
          className="bg-secondary text-foreground focus-visible:ring-ring fixed end-4 bottom-4 z-50 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-[13px] font-medium shadow-md transition-transform focus-visible:ring-2 focus-visible:outline-none active:scale-[0.94] disabled:cursor-default disabled:opacity-60"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
          </svg>
          {playing ? 'Playing' : 'Play'}
        </button>
      ) : null}
    </div>
  );
}

const withTheme: Decorator = (Story, context) => {
  const root = document.documentElement;
  root.classList.toggle('dark', context.globals.theme === 'dark');
  root.dir = context.globals.direction === 'rtl' ? 'rtl' : 'ltr';
  return <Story />;
};

const withPlayback: Decorator = (Story) => (
  <PlaybackStage>
    <Story />
  </PlaybackStage>
);

const preview: Preview = {
  decorators: [withPlayback, withTheme],
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Color scheme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Text direction',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left to right' },
          { value: 'rtl', title: 'Right to left' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', direction: 'ltr' },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'AI Elements',
          'Components',
          'Layout',
          'Hybrids',
          'Bricks',
          'Examples',
          'Icons',
        ],
      },
    },
  },
};

export default preview;
