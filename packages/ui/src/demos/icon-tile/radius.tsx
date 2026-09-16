import { IconTile } from '../../components/icon-tile';
import { CameraIcon } from '../../icons/camera';
import { GlobeIcon } from '../../icons/globe';
import { MailIcon } from '../../icons/mail';

export function Radius() {
  return (
    <div className="flex items-center gap-3">
      <IconTile radius="full">
        <CameraIcon />
      </IconTile>
      <IconTile radius="full" variant="soft" tone="info">
        <GlobeIcon />
      </IconTile>
      <IconTile radius="full" variant="solid" tone="success">
        <MailIcon />
      </IconTile>
    </div>
  );
}
