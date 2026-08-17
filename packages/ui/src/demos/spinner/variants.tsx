'use client';

import { Spinner } from '../../components/spinner';

const variants = ['default', 'muted', 'success', 'destructive', 'warning', 'info'] as const;

export function Variants() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {variants.map((variant) => (
        <Spinner key={variant} variant={variant} />
      ))}
    </div>
  );
}
