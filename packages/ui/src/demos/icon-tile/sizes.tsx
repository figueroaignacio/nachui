import { Rocket01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '../../components/icon-tile';

const SIZES = ['xs', 'sm', 'default', 'lg', 'xl'] as const;

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconTile size={size} variant="elevated">
            <HugeiconsIcon icon={Rocket01Icon} />
          </IconTile>
          <span className="text-muted-foreground font-mono text-xs">{size}</span>
        </div>
      ))}
    </div>
  );
}
