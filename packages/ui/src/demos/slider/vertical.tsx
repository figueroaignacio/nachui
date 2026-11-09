'use client';

import * as React from 'react';
import { Slider } from '../../components/slider';

const bands = [
  { id: 'bass', label: 'Bass', frequency: '80 Hz', gain: 4 },
  { id: 'mid', label: 'Mid', frequency: '1 kHz', gain: -2 },
  { id: 'treble', label: 'Treble', frequency: '8 kHz', gain: 3 },
];

function formatGain(value: number) {
  return `${value > 0 ? '+' : ''}${value} dB`;
}

export function Vertical() {
  const [gains, setGains] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(bands.map((band) => [band.id, band.gain])),
  );

  return (
    <div className="flex items-end gap-10">
      {bands.map((band) => {
        const gain = gains[band.id] ?? 0;
        return (
          <div key={band.id} className="flex flex-col items-center gap-3">
            <span className="text-muted-foreground text-xs tabular-nums">{formatGain(gain)}</span>
            <Slider
              orientation="vertical"
              className="h-36"
              min={-12}
              max={12}
              value={[gain]}
              onValueChange={([next = 0]) =>
                setGains((current) => ({ ...current, [band.id]: next }))
              }
              getAriaValueText={formatGain}
            >
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb aria-label={`${band.label} gain`} />
            </Slider>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{band.label}</span>
              <span className="text-muted-foreground text-xs">{band.frequency}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
