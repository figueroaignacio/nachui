import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  InformationCircleIcon,
  PaintBoardIcon,
  UserIcon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '../../components/icon-tile';

const TONES = [
  { tone: 'default', icon: PaintBoardIcon },
  { tone: 'muted', icon: UserIcon },
  { tone: 'primary', icon: ZapIcon },
  { tone: 'success', icon: CheckmarkCircle02Icon },
  { tone: 'warning', icon: Alert02Icon },
  { tone: 'info', icon: InformationCircleIcon },
  { tone: 'destructive', icon: Delete02Icon },
] as const;

export function Tones() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {TONES.map(({ tone, icon }) => (
          <IconTile key={tone} tone={tone} variant="soft">
            <HugeiconsIcon icon={icon} />
          </IconTile>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {TONES.map(({ tone, icon }) => (
          <IconTile key={tone} tone={tone} variant="solid">
            <HugeiconsIcon icon={icon} />
          </IconTile>
        ))}
      </div>
    </div>
  );
}
