'use client';

import { Card } from '@repo/ui/components/card';
import { NumberField } from '@repo/ui/components/number-field';

const guests = [
  { label: 'Adults', value: 2 },
  { label: 'Children', value: 1 },
  { label: 'Pets', value: 0 },
];

export function PreviewGuests() {
  return (
    <Card className="gap-3 p-4">
      <p className="text-foreground text-sm font-semibold">Guests</p>
      {guests.map((guest) => (
        <div key={guest.label} className="flex items-center justify-between gap-3">
          <span className="text-muted-strong text-xs">{guest.label}</span>
          <NumberField
            defaultValue={guest.value}
            min={0}
            max={9}
            aria-label={guest.label}
            className="w-28"
          >
            <NumberField.Group>
              <NumberField.Decrement />
              <NumberField.Input />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField>
        </div>
      ))}
    </Card>
  );
}
