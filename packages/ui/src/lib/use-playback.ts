'use client';

import * as React from 'react';

export const PLAYBACK_EVENT = 'playback:play';

export function usePlayback<T extends HTMLElement = HTMLDivElement>(steps: number, interval = 100) {
  const ref = React.useRef<T>(null);
  const [step, setStep] = React.useState(steps);
  const playing = step < steps;

  const play = React.useCallback(() => setStep(0), []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener(PLAYBACK_EVENT, play);
    return () => element.removeEventListener(PLAYBACK_EVENT, play);
  }, [play]);

  React.useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setStep((value) => value + 1), interval);
    return () => clearTimeout(timer);
  }, [step, playing, interval]);

  return {
    step,
    playing,
    play,
    rootProps: { ref, 'data-playback': playing ? 'playing' : 'idle' } as const,
  };
}
