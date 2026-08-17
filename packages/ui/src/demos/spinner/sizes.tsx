'use client';

import { Spinner } from '../../components/spinner';

const sizes = ['sm', 'md', 'lg', 'xl'] as const;

export function Sizes() {
  return (
    <div className="flex items-end justify-center gap-6 py-8">
      {sizes.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  );
}
