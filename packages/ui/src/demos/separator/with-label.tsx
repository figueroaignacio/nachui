'use client';

import { Separator } from '../../components/separator';

const labels = ['OR', 'or continue with'] as const;

export function WithLabel() {
  return (
    <div className="w-full max-w-sm space-y-4">
      {labels.map((label) => (
        <Separator key={label} label={label} />
      ))}
    </div>
  );
}
