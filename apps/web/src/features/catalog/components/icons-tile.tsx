import { Link } from '@/i18n/navigation';
import { ArrowUpRightIcon } from '@repo/ui/icons/arrow-up-right';
import { BellIcon } from '@repo/ui/icons/bell';
import { BookmarkIcon } from '@repo/ui/icons/bookmark';
import { CalendarIcon } from '@repo/ui/icons/calendar';
import { CheckCircleIcon } from '@repo/ui/icons/check-circle';
import { ClockIcon } from '@repo/ui/icons/clock';
import { CloudUploadIcon } from '@repo/ui/icons/cloud-upload';
import { CodeIcon } from '@repo/ui/icons/code';
import { CopyIcon } from '@repo/ui/icons/copy';
import { EyeIcon } from '@repo/ui/icons/eye';
import { FilterIcon } from '@repo/ui/icons/filter';
import { FolderIcon } from '@repo/ui/icons/folder';
import { HeartIcon } from '@repo/ui/icons/heart';
import { HomeIcon } from '@repo/ui/icons/home';
import { SearchIcon } from '@repo/ui/icons/search';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { cn } from '@repo/ui/lib/cn';
import { TileArrow, tileClassName, tileFooterClassName, tileStageClassName } from './tile-parts';

const SAMPLE = [
  SparklesIcon,
  SearchIcon,
  CodeIcon,
  CalendarIcon,
  BellIcon,
  HomeIcon,
  FolderIcon,
  ClockIcon,
  HeartIcon,
  CloudUploadIcon,
  CopyIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  FilterIcon,
  EyeIcon,
  BookmarkIcon,
];

interface IconsTileProps {
  caption: string;
  /** How many of the sample icons to draw; the landing shows fewer. */
  limit?: number;
  tag?: string;
  className?: string;
}

/** The icon family as one tile: a sample of the set and a link to its page. */
export function IconsTile({ caption, limit = SAMPLE.length, tag, className }: IconsTileProps) {
  return (
    <Link href="/docs/elements/icons" className={cn(tileClassName, className)}>
      <div
        aria-hidden="true"
        className={cn(
          tileStageClassName,
          'text-muted-strong flex flex-wrap content-center items-center justify-center gap-2 p-5',
        )}
      >
        {SAMPLE.slice(0, limit).map((Icon, index) => (
          <span
            key={index}
            className="bg-card border-border flex size-12 items-center justify-center rounded-sm border"
          >
            <Icon size={20} />
          </span>
        ))}
      </div>
      <div className={tileFooterClassName}>
        <span className="truncate">{caption}</span>
        {tag && <span className="section-label ms-auto uppercase">{tag}</span>}
        <TileArrow className={tag ? undefined : 'ms-auto'} />
      </div>
    </Link>
  );
}
