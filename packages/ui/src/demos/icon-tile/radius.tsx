import { Camera01Icon, Globe02Icon, Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '../../components/icon-tile';

export function Radius() {
  return (
    <div className="flex items-center gap-3">
      <IconTile radius="full">
        <HugeiconsIcon icon={Camera01Icon} />
      </IconTile>
      <IconTile radius="full" variant="soft" tone="info">
        <HugeiconsIcon icon={Globe02Icon} />
      </IconTile>
      <IconTile radius="full" variant="solid" tone="success">
        <HugeiconsIcon icon={Mail01Icon} />
      </IconTile>
    </div>
  );
}
