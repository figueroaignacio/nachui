'use client';

import { Sprite } from '../../components/sprite';

const seeds = ['nachui', 'figueroaignacio', 'mate', 'bit', 'vera', 'lupe'];

export function Seeds() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {seeds.map((seed) => (
        <div key={seed} className="flex flex-col items-center gap-3">
          <Sprite seed={seed} size={64} />
          <span className="text-muted-foreground font-mono text-xs">{seed}</span>
        </div>
      ))}
    </div>
  );
}
