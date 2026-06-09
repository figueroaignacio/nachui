'use client';

import { Label } from '../../components/label';
import { Radio } from '../../components/radio';

const options = [
  { id: 'option-one', label: 'Option One', defaultChecked: true },
  { id: 'option-two', label: 'Option Two' },
];

export function WithLabel() {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <div key={option.id} className="flex items-center gap-2">
          <Radio id={option.id} name="radio-group" defaultChecked={option.defaultChecked} />
          <Label htmlFor={option.id}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
}
