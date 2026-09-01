import {
  CreditCardIcon,
  Folder01Icon,
  Notification01Icon,
  Shield01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '../../components/icon-tile';

export function Default() {
  return (
    <div className="flex items-center gap-3">
      <IconTile>
        <HugeiconsIcon icon={Folder01Icon} />
      </IconTile>
      <IconTile variant="elevated">
        <HugeiconsIcon icon={Notification01Icon} />
      </IconTile>
      <IconTile variant="frame">
        <HugeiconsIcon icon={CreditCardIcon} />
      </IconTile>
      <IconTile variant="solid" tone="primary">
        <HugeiconsIcon icon={Shield01Icon} />
      </IconTile>
    </div>
  );
}
