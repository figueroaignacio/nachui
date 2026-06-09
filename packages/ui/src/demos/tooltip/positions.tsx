'use client';

import { Button } from '../../components/button';
import { Tooltip } from '../../components/tooltip';

const positions = [
  { label: 'Top', side: 'top', content: 'Tooltip on top' },
  { label: 'Bottom', side: 'bottom', content: 'Tooltip on bottom' },
  { label: 'Left', side: 'left', content: 'Tooltip on left' },
  { label: 'Right', side: 'right', content: 'Tooltip on right' },
] as const;

export function Positions() {
  return (
    <div className="flex flex-col items-center gap-10 md:flex-row">
      {positions.map(({ label, side, content }) => (
        <Tooltip key={side}>
          <Tooltip.Trigger asChild>
            <Button variant="outline">{label}</Button>
          </Tooltip.Trigger>
          <Tooltip.Content side={side}>{content}</Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  );
}
