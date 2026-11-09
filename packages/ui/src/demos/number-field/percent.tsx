'use client';

import * as React from 'react';
import { Label } from '../../components/label';
import { NumberField } from '../../components/number-field';

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function Percent() {
  const id = React.useId();
  const [discount, setDiscount] = React.useState<number | null>(0.15);

  return (
    <div className="flex w-full max-w-56 flex-col gap-1.5">
      <Label htmlFor={id}>Launch discount</Label>
      <NumberField
        id={id}
        value={discount}
        onValueChange={setDiscount}
        min={0}
        max={0.5}
        step={0.01}
        largeStep={0.05}
        format={{ style: 'percent' }}
        allowWheel
      >
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField>
      <p className="text-muted-foreground text-xs">
        {discount === null
          ? 'No discount applied.'
          : `The 120 dollar plan sells for ${dollars.format(120 * (1 - discount))}.`}
      </p>
    </div>
  );
}
