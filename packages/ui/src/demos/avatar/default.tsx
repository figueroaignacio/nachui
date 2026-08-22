'use client';

import { Avatar } from '../../components/avatar';

export function Default() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <Avatar.Image src="https://github.com/figueroaignacio.png" alt="Ignacio Figueroa" />
        <Avatar.Fallback>IF</Avatar.Fallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">Ignacio Figueroa</p>
        <p className="text-muted-foreground text-xs">Signed in as owner</p>
      </div>
    </div>
  );
}
