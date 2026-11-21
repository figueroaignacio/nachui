'use client';

import { Actions } from '@repo/ui/ai/actions';
import { Badge } from '@repo/ui/components/badge';
import { Card } from '@repo/ui/components/card';
import { CheckIcon } from '@repo/ui/icons/check';

const findings = [
  'Most guests book from their phone',
  'Payment is where people drop off',
  'They ask to save favorites',
];

export function PreviewAiSummary() {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-foreground text-sm font-semibold">Research summary</p>
        <Badge variant="secondary" className="font-mono text-xs">
          3 sources
        </Badge>
      </div>
      <div className="text-muted-strong space-y-2 text-xs">
        {findings.map((finding) => (
          <p key={finding} className="flex items-start gap-2">
            <CheckIcon size={13} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
            {finding}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <Badge variant="outline" className="font-mono text-xs">
            survey.csv
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            interviews
          </Badge>
        </div>
        <Actions>
          <Actions.Button label="Good response" active>
            <Actions.Icons.thumbsUp />
          </Actions.Button>
          <Actions.Button label="Bad response">
            <Actions.Icons.thumbsDown />
          </Actions.Button>
        </Actions>
      </div>
    </Card>
  );
}
