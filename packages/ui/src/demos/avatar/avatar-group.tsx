'use client';

import { Avatar } from '../../components/avatar';

const reviewers = [
  { src: 'https://github.com/figueroaignacio.png', name: 'Ignacio Figueroa', initials: 'IF' },
  { src: 'https://github.com/nicvazquezdev.png', name: 'Nicolas Vazquez', initials: 'NV' },
  { src: 'https://github.com/ManuZarraga.png', name: 'Manuel Zarraga', initials: 'MZ' },
];

export function AvatarGroup() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-4">
      <p className="text-sm font-medium">Fix cart totals on partial refunds</p>
      <p className="text-muted-foreground mt-1 text-xs">#412 opened 3 days ago by lucia</p>
      <div className="mt-4 flex items-center gap-3">
        <Avatar.Group>
          {reviewers.map((reviewer) => (
            <Avatar key={reviewer.name} size="sm">
              <Avatar.Image src={reviewer.src} alt={reviewer.name} />
              <Avatar.Fallback>{reviewer.initials}</Avatar.Fallback>
            </Avatar>
          ))}
          <Avatar size="sm">
            <Avatar.Fallback className="bg-muted text-muted-foreground text-xs">+3</Avatar.Fallback>
          </Avatar>
        </Avatar.Group>
        <span className="text-muted-foreground text-xs">6 reviewers requested</span>
      </div>
    </div>
  );
}
