'use client';

import { Avatar } from '../../components/avatar';
import { Badge } from '../../components/badge';

const invites = [
  {
    // The photo URL is stale, so the image fails and the initials take over.
    src: 'https://github.com/figueroaignacio.pn',
    name: 'Camila Ortiz',
    email: 'camila@acmestudio.dev',
    initials: 'CO',
    initialsClassName: undefined,
  },
  {
    // Invited by email, no photo on file yet.
    src: undefined,
    name: 'Tomas Iglesias',
    email: 'tomas@acmestudio.dev',
    initials: 'TI',
    initialsClassName: 'bg-primary text-primary-foreground',
  },
];

export function WithFallback() {
  return (
    <div className="border-border bg-card w-full max-w-sm rounded-xl border p-4">
      <p className="text-muted-foreground mb-3 text-xs">Pending invites</p>
      <div className="flex flex-col gap-4">
        {invites.map((invite) => (
          <div key={invite.email} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar>
                {invite.src ? <Avatar.Image src={invite.src} alt={invite.name} /> : null}
                <Avatar.Fallback className={invite.initialsClassName}>
                  {invite.initials}
                </Avatar.Fallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{invite.name}</p>
                <p className="text-muted-foreground truncate text-xs">{invite.email}</p>
              </div>
            </div>
            <Badge variant="secondary">Invited</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
