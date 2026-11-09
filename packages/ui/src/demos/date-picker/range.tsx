'use client';

import type { DateRange } from '../../components/calendar';
import { DatePicker, type DatePickerPreset } from '../../components/date-picker';
import { Label } from '../../components/label';
import { addDays, endOfWeek, startOfWeek, today, weekStartFor } from '../../lib/date';

function weekFrom(offset: number): DateRange {
  const start = startOfWeek(addDays(today(), offset * 7), weekStartFor());
  return { start, end: endOfWeek(start, weekStartFor()) };
}

const presets: DatePickerPreset<DateRange>[] = [
  { label: 'This week', value: () => weekFrom(0) },
  { label: 'Next week', value: () => weekFrom(1) },
  { label: 'Next 14 days', value: () => ({ start: today(), end: addDays(today(), 13) }) },
];

export function Range() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="time-off" description="Your team sees this on the shared calendar.">
        Time off
      </Label>
      <DatePicker
        id="time-off"
        mode="range"
        name="timeOff"
        placeholder="Pick your dates"
        presets={presets}
        showFooter
      />
    </div>
  );
}
