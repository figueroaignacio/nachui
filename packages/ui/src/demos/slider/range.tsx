'use client';

import * as React from 'react';
import { Slider } from '../../components/slider';

const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function Range() {
  const [price, setPrice] = React.useState([180, 720]);
  const [low = 0, high = 0] = price;

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Price per night</span>
        <span className="text-muted-foreground tabular-nums">
          {dollars.format(low)} to {dollars.format(high)}
        </span>
      </div>
      <Slider
        value={price}
        onValueChange={setPrice}
        min={0}
        max={1000}
        step={10}
        largeStep={100}
        minStepsBetweenThumbs={5}
        getAriaValueText={(value) => dollars.format(value)}
      >
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb aria-label="Minimum price" />
        <Slider.Thumb aria-label="Maximum price" />
      </Slider>
    </div>
  );
}
