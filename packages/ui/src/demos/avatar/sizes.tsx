'use client';

import { Avatar } from '../../components/avatar';

const sizes = [
  { size: 'sm' as const, fallback: 'FI' },
  { size: 'md' as const, fallback: 'FI' },
  { size: 'lg' as const, fallback: 'FI' },
];

export function Sizes() {
  return (
    <div className="flex items-center gap-4">
      {sizes.map((avatar) => (
        <Avatar key={avatar.size} size={avatar.size}>
          <Avatar.Image src="https://github.com/figueroaignacio.png" alt="@figueroaignacio" />
          <Avatar.Fallback>{avatar.fallback}</Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  );
}
