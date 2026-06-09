'use client';

import { Label } from '../../components/label';
import { Radio } from '../../components/radio';

const options = [
  { id: 'disabled-option', label: 'Disabled option', defaultChecked: false },
  { id: 'disabled-checked', label: 'Disabled selected option', defaultChecked: true },
] as const;

export function Disabled() {
  return (
    <div className="flex flex-col gap-3">
      {options.map(({ id, label, defaultChecked }) => (
        <div key={id} className="flex items-center gap-2">
          <Radio id={id} disabled name="disabled-group" defaultChecked={defaultChecked} />
          <Label htmlFor={id} className="opacity-50">
            {label}
          </Label>
        </div>
      ))}
    </div>
  );
}
