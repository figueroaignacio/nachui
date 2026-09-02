'use client';

import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '../../components/avatar';
import { Button } from '../../components/button';
import { HoverCard } from '../../components/hover-card';

export function Default() {
  return (
    <HoverCard>
      <HoverCard.Trigger asChild>
        <Button variant="link">@figueroaignacio</Button>
      </HoverCard.Trigger>
      <HoverCard.Content className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <Avatar.Image src="https://github.com/figueroaignacio.png" alt="Ignacio Figueroa" />
            <Avatar.Fallback>IF</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">@figueroaignacio</p>
            <p className="text-muted-foreground text-xs">
              Building NachUI, a copy-paste component library with zero dependencies.
            </p>
            <p className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
              <HugeiconsIcon icon={Calendar03Icon} size={14} />
              Joined March 2024
            </p>
          </div>
        </div>
      </HoverCard.Content>
    </HoverCard>
  );
}
