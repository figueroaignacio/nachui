'use client';

import { Calendar } from '@repo/ui/components/calendar';
import { Card } from '@repo/ui/components/card';

export function PreviewDateRange() {
  return (
    <Card className="items-center p-3">
      <Calendar
        mode="range"
        locale="en-US"
        today="2026-11-10"
        defaultMonth="2026-11-01"
        defaultValue={{ start: '2026-11-10', end: '2026-11-14' }}
      />
    </Card>
  );
}
