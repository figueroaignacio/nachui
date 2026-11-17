'use client';

import { Avatar } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import Image from 'next/image';

export function PreviewProfile() {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <Image
        src="/images/landing/road.jpg"
        alt=""
        width={640}
        height={480}
        sizes="312px"
        className="h-24 w-full object-cover"
      />
      <div className="space-y-3 p-4 pt-0">
        <div className="-mt-6 flex items-end justify-between">
          <Avatar size="lg" className="ring-card ring-4">
            <Avatar.Fallback className="bg-brand-highlight text-brand-highlight-foreground text-sm font-semibold">
              LM
            </Avatar.Fallback>
          </Avatar>
          <Button size="sm">Follow</Button>
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">Lucía Méndez</p>
          <p className="text-muted-foreground text-xs">Product designer in Córdoba</p>
        </div>
        <div className="flex gap-1.5">
          <Badge variant="info" className="text-xs">
            Design systems
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Motion
          </Badge>
        </div>
      </div>
    </Card>
  );
}
