import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { cn } from '@repo/ui/lib/cn';
import Image from 'next/image';

const variations = ['sea', 'lake-dock', 'forest', 'road'];

export function PreviewAiVariations() {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-foreground text-sm font-semibold">4 variations</p>
        <p className="text-brand-text font-mono text-xs">pick one</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {variations.map((variation, index) => (
          <Image
            key={variation}
            src={`/images/landing/${variation}.jpg`}
            alt=""
            width={640}
            height={480}
            sizes="140px"
            className={cn(
              'h-20 w-full rounded-md object-cover',
              index === 1 && 'ring-primary ring-offset-card ring-2 ring-offset-2',
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm">Use this one</Button>
        <Button size="sm" variant="outline">
          Try again
        </Button>
      </div>
    </Card>
  );
}
