import { IconTile } from '../../components/icon-tile';
import { BellIcon } from '../../icons/bell';
import { CreditCardIcon } from '../../icons/credit-card';
import { FolderIcon } from '../../icons/folder';
import { ShieldIcon } from '../../icons/shield';

export function Default() {
  return (
    <div className="flex items-center gap-3">
      <IconTile>
        <FolderIcon />
      </IconTile>
      <IconTile variant="elevated">
        <BellIcon />
      </IconTile>
      <IconTile variant="frame">
        <CreditCardIcon />
      </IconTile>
      <IconTile variant="solid" tone="primary">
        <ShieldIcon />
      </IconTile>
    </div>
  );
}
