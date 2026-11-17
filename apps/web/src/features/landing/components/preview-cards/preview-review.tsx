'use client';

import { Avatar } from '@repo/ui/components/avatar';
import { Card } from '@repo/ui/components/card';
import { Rating } from '@repo/ui/components/rating';

export function PreviewReview() {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <Avatar.Fallback className="bg-brand-highlight text-brand-highlight-foreground text-xs font-semibold">
            JR
          </Avatar.Fallback>
        </Avatar>
        <div>
          <p className="text-foreground text-xs font-semibold">Julia R.</p>
          <Rating size="sm" value={5} readOnly aria-label="5 out of 5" />
        </div>
      </div>
      <p className="text-muted-strong text-xs leading-relaxed">
        The dock at sunrise is worth the trip. Everything looked just like the photos.
      </p>
    </Card>
  );
}
