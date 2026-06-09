'use client';

import { Input } from '../../components/input';

const sizes = [
  { size: 'sm' as const, placeholder: 'Small input' },
  { size: 'default' as const, placeholder: 'Default input' },
  { size: 'lg' as const, placeholder: 'Large input' },
];

export function Sizes() {
  return (
    <div className="flex flex-col gap-4">
      {sizes.map((input) => (
        <Input key={input.size} size={input.size} placeholder={input.placeholder} />
      ))}
    </div>
  );
}
