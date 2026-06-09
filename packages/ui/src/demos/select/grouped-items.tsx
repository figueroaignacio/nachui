'use client';

import { Select } from '../../components/select';

const groups = [
  {
    label: 'Citrus',
    options: [
      { value: 'orange', label: 'Orange' },
      { value: 'lemon', label: 'Lemon' },
      { value: 'lime', label: 'Lime' },
    ],
  },
  {
    label: 'Berries',
    options: [
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'blueberry', label: 'Blueberry' },
      { value: 'raspberry', label: 'Raspberry' },
    ],
  },
] as const;

export function GroupedItems() {
  return (
    <div className="w-full max-w-xs">
      <Select defaultValue="" aria-label="Select a fruit">
        <option value="" disabled>
          Select a fruit
        </option>
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
    </div>
  );
}
