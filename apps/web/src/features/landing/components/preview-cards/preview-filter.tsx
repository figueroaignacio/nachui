'use client';

import { Badge } from '@repo/ui/components/badge';
import { Card } from '@repo/ui/components/card';
import { Slider } from '@repo/ui/components/slider';

export function PreviewFilter() {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-foreground text-sm font-semibold">Price per night</p>
        <p className="text-brand-text font-mono text-xs">$80 to $160</p>
      </div>
      <Slider defaultValue={[80, 160]} min={0} max={240} step={10}>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb aria-label="Minimum price" />
        <Slider.Thumb aria-label="Maximum price" />
      </Slider>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-xs">
          Wifi
        </Badge>
        <Badge variant="secondary" className="text-xs">
          Pets
        </Badge>
        <Badge variant="outline" className="text-xs">
          Pool
        </Badge>
        <Badge variant="outline" className="text-xs">
          Kitchen
        </Badge>
      </div>
    </Card>
  );
}
