import { IconTile } from '../../components/icon-tile';
import { AlertTriangleIcon } from '../../icons/alert-triangle';
import { CheckCircleIcon } from '../../icons/check-circle';
import { InfoIcon } from '../../icons/info';
import { PaletteIcon } from '../../icons/palette';
import { TrashIcon } from '../../icons/trash';
import { UserIcon } from '../../icons/user';
import { ZapIcon } from '../../icons/zap';

const TONES = [
  { tone: 'default', icon: PaletteIcon },
  { tone: 'muted', icon: UserIcon },
  { tone: 'primary', icon: ZapIcon },
  { tone: 'success', icon: CheckCircleIcon },
  { tone: 'warning', icon: AlertTriangleIcon },
  { tone: 'info', icon: InfoIcon },
  { tone: 'destructive', icon: TrashIcon },
] as const;

export function Tones() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {TONES.map(({ tone, icon: Icon }) => (
          <IconTile key={tone} tone={tone} variant="soft">
            <Icon />
          </IconTile>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {TONES.map(({ tone, icon: Icon }) => (
          <IconTile key={tone} tone={tone} variant="solid">
            <Icon />
          </IconTile>
        ))}
      </div>
    </div>
  );
}
