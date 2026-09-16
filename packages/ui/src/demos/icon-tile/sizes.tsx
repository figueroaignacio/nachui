import { IconTile } from '../../components/icon-tile';
import { RocketIcon } from '../../icons/rocket';

const SIZES = ['xs', 'sm', 'default', 'lg', 'xl'] as const;

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconTile size={size} variant="elevated">
            <RocketIcon />
          </IconTile>
          <span className="text-muted-foreground font-mono text-xs">{size}</span>
        </div>
      ))}
    </div>
  );
}
