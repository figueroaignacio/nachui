'use client';

import { Calendar } from '../../components/calendar';
import { dayOfWeek, type PlainDate } from '../../lib/date';

function isWeekend(date: PlainDate) {
  const weekday = dayOfWeek(date);
  return weekday === 0 || weekday === 6;
}

export function DisabledDates() {
  return <Calendar isDateDisabled={isWeekend} className="bg-card rounded-lg shadow-sm" />;
}
