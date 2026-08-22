'use client';

import { Sprite } from '../../components/sprite';

const states = [
  { state: 'idle', label: 'idle' },
  { state: 'walk', label: 'walk' },
  { state: 'work', label: 'work' },
  { state: 'loop', label: 'loop' },
] as const;

export function States() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {states.map(({ state, label }) => (
        <div key={state} className="flex flex-col items-center gap-3">
          <Sprite seed="nachui" state={state} size={72} />
          <span className="text-muted-foreground font-mono text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
