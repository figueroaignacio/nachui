'use client';

import { Badge } from '@repo/ui/components/badge';
import { Bubble } from '@repo/ui/components/bubble';
import { Card } from '@repo/ui/components/card';
import { CheckIcon } from '@repo/ui/icons/check';
import Image from 'next/image';

const answer = ['Layers for the cold', '2 liters of water a day', 'A headlamp'];

export function PreviewAiChat() {
  return (
    <Card className="gap-3 p-4">
      <Bubble.Group align="end">
        <Bubble align="end">
          <Bubble.Content className="space-y-2 p-2">
            <Image
              src="/images/landing/hiker.jpg"
              alt=""
              width={640}
              height={480}
              sizes="240px"
              className="h-28 w-56 rounded-md object-cover"
            />
            <p className="px-1 pb-0.5 text-xs font-medium">What should I pack for this trek?</p>
          </Bubble.Content>
        </Bubble>
      </Bubble.Group>
      <Bubble.Group align="start">
        <Bubble variant="secondary">
          <Bubble.Content className="space-y-1.5 text-xs">
            <p className="font-semibold">For two days in the mountains:</p>
            {answer.map((item) => (
              <p key={item} className="flex items-center gap-2">
                <CheckIcon size={13} className="text-primary shrink-0" aria-hidden="true" />
                {item}
              </p>
            ))}
          </Bubble.Content>
        </Bubble>
      </Bubble.Group>
      <div className="flex gap-1.5">
        <Badge variant="secondary" className="font-mono text-xs">
          guide.pdf
        </Badge>
        <Badge variant="secondary" className="font-mono text-xs">
          forecast
        </Badge>
      </div>
    </Card>
  );
}
