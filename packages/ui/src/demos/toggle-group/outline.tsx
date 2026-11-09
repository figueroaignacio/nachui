'use client';

import { useState } from 'react';
import { ToggleGroup } from '../../components/toggle-group';

const ranges = {
  day: 'Tuesday, November 10',
  week: 'November 9 to 15',
  month: 'November 2026',
};

type Range = keyof typeof ranges;

export function Outline() {
  const [range, setRange] = useState<Range>('week');

  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        required
        value={range}
        onValueChange={(value) => setRange(value as Range)}
        aria-label="Calendar range"
      >
        <ToggleGroup.Item value="day" className="px-4">
          Day
        </ToggleGroup.Item>
        <ToggleGroup.Item value="week" className="px-4">
          Week
        </ToggleGroup.Item>
        <ToggleGroup.Item value="month" className="px-4">
          Month
        </ToggleGroup.Item>
      </ToggleGroup>
      <p className="text-muted-foreground text-sm">{ranges[range]}</p>
    </div>
  );
}
