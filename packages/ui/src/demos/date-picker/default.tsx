'use client';

import { DatePicker } from '../../components/date-picker';
import { Label } from '../../components/label';
import { dayOfWeek, type PlainDate, today } from '../../lib/date';

function isUnavailable(date: PlainDate) {
  return date < today() || dayOfWeek(date) === 0;
}

export function Default() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="delivery-date" description="We deliver Monday to Saturday.">
        Delivery date
      </Label>
      <DatePicker
        id="delivery-date"
        name="deliveryDate"
        placeholder="Pick a day"
        isDateDisabled={isUnavailable}
      />
    </div>
  );
}
