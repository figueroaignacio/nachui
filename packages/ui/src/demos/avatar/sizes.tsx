'use client';

import { Avatar } from '../../components/avatar';

const rows = [
  {
    size: 'sm' as const,
    src: 'https://github.com/nicvazquezdev.png',
    name: 'Nicolas Vazquez',
    detail: 'commented on checkout-flow, 2m ago',
  },
  {
    size: 'md' as const,
    src: 'https://github.com/ManuZarraga.png',
    name: 'Manuel Zarraga',
    detail: 'Engineering, joined Feb 2024',
  },
  {
    size: 'lg' as const,
    src: 'https://github.com/figueroaignacio.png',
    name: 'Ignacio Figueroa',
    detail: 'Workspace owner, acmestudio.dev',
  },
];

export function Sizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {rows.map((row) => (
        <div key={row.size} className="flex items-center gap-3">
          <Avatar size={row.size}>
            <Avatar.Image src={row.src} alt={row.name} />
            <Avatar.Fallback>
              {row.name
                .split(' ')
                .map((part) => part.charAt(0))
                .join('')}
            </Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.name}</p>
            <p className="text-muted-foreground truncate text-xs">{row.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
