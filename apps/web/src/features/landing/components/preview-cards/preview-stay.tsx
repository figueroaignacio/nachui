import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { StarIcon } from '@repo/ui/icons/star';
import Image from 'next/image';

export function PreviewStay() {
  return (
    <Card className="gap-3 p-3">
      <Image
        src="/images/landing/lake-dock.jpg"
        alt=""
        width={640}
        height={480}
        sizes="312px"
        className="h-40 w-full rounded-md object-cover"
      />
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-foreground text-sm font-semibold">Lakeside cabin</p>
          <p className="text-muted-foreground text-xs">Bariloche, 2 guests</p>
        </div>
        <Badge variant="secondary" className="gap-1 text-xs">
          <StarIcon size={12} fill="currentColor" aria-hidden="true" />
          4.9
        </Badge>
      </div>
      <div className="flex items-center justify-between gap-3 px-1 pb-1">
        <p className="text-foreground text-sm font-semibold">
          $120 <span className="text-muted-foreground font-normal">per night</span>
        </p>
        <Button size="sm">Reserve</Button>
      </div>
    </Card>
  );
}
