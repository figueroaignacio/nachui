'use client';

import { Avatar } from '../../components/avatar';

const avatars = [
  {
    src: 'https://github.com/figueroaignacio.pn', // broken link — tests image fallback
    alt: '@figueroaignacio',
    fallback: 'FI',
    fallbackClassName: undefined,
  },
  {
    src: undefined, // no image — tests text fallback
    alt: undefined,
    fallback: 'FI',
    fallbackClassName: 'bg-primary text-primary-foreground',
  },
];

export function WithFallback() {
  return (
    <div className="flex gap-4">
      {avatars.map((avatar, i) => (
        <Avatar key={i}>
          {avatar.src && <Avatar.Image src={avatar.src} alt={avatar.alt ?? ''} />}
          <Avatar.Fallback className={avatar.fallbackClassName}>{avatar.fallback}</Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  );
}
