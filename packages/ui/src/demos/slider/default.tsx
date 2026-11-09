'use client';

import * as React from 'react';
import { Slider } from '../../components/slider';

export function Default() {
  const labelId = React.useId();
  const [volume, setVolume] = React.useState([64]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span id={labelId} className="font-medium">
          Volume
        </span>
        <span className="text-muted-foreground tabular-nums">{volume[0]}%</span>
      </div>
      <Slider value={volume} onValueChange={setVolume} max={100}>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb aria-labelledby={labelId} />
      </Slider>
    </div>
  );
}
