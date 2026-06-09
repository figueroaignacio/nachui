'use client';

import { Radio } from '../../components/radio';

const radios = [
  { label: 'Default radio', defaultChecked: false },
  { label: 'Selected default radio', defaultChecked: true },
] as const;

export function Default() {
  return (
    <div className="flex gap-4">
      {radios.map(({ label, defaultChecked }) => (
        <Radio key={label} aria-label={label} name="default" defaultChecked={defaultChecked} />
      ))}
    </div>
  );
}
