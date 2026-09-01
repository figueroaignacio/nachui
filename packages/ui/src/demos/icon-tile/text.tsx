import { IconTile } from '../../components/icon-tile';

export function Text() {
  return (
    <div className="flex items-center gap-3">
      <IconTile variant="soft" tone="primary">
        IF
      </IconTile>
      <IconTile variant="solid">NV</IconTile>
      <IconTile variant="frame" radius="full">
        MZ
      </IconTile>
      <IconTile variant="elevated" size="lg">
        +3
      </IconTile>
    </div>
  );
}
