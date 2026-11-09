'use client';

import * as React from 'react';
import { Label } from '../../components/label';
import { NumberField } from '../../components/number-field';

export function Default() {
  const id = React.useId();

  return (
    <div className="flex w-36 flex-col gap-1.5">
      <Label htmlFor={id}>Quantity</Label>
      <NumberField id={id} name="quantity" defaultValue={1} min={1} max={99}>
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField>
    </div>
  );
}
