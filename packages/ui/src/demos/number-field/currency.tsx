'use client';

import * as React from 'react';
import { Label } from '../../components/label';
import { NumberField } from '../../components/number-field';

export function Currency() {
  const id = React.useId();

  return (
    <div className="flex w-full max-w-56 flex-col gap-1.5">
      <Label htmlFor={id} description="Rounded to the nearest $50.">
        Monthly ad budget
      </Label>
      <NumberField
        id={id}
        name="budget"
        defaultValue={1500}
        min={0}
        max={20000}
        step={50}
        largeStep={500}
        format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
        aria-describedby={`${id}-label-description`}
      >
        <NumberField.Group>
          <NumberField.Decrement aria-label="Decrease by $50" />
          <NumberField.Input />
          <NumberField.Increment aria-label="Increase by $50" />
        </NumberField.Group>
      </NumberField>
    </div>
  );
}
