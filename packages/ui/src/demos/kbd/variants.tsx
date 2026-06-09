'use client';

import { Kbd } from '../../components/kbd';

const variants = ['default', 'outline'] as const;

export function Variants() {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Kbd key={variant} variant={variant}>
          Shift
        </Kbd>
      ))}
    </div>
  );
}
