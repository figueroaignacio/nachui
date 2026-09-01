import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '../../components/icon-tile';

const VARIANTS = ['outline', 'elevated', 'soft', 'solid', 'frame'] as const;

export function Variants() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <IconTile variant={variant} tone="primary">
            <HugeiconsIcon icon={SparklesIcon} />
          </IconTile>
          <span className="text-muted-foreground font-mono text-xs">{variant}</span>
        </div>
      ))}
    </div>
  );
}
