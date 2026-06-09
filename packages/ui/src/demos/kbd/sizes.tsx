'use client';

import { Kbd } from '../../components/kbd';

const sizes = ['sm', 'default', 'lg'] as const;

export function Sizes() {
  return (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Kbd key={size} size={size}>
          ⌘
        </Kbd>
      ))}
    </div>
  );
}
