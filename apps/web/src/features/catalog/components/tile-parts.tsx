import { ArrowUpRightIcon } from '@repo/ui/icons/arrow-up-right';
import { cn } from '@repo/ui/lib/cn';

/**
 * The pieces every catalog tile shares. They live outside the client tile so a
 * server component can read the class names as plain strings.
 */
export const tileClassName =
  'group/tile bg-island hover:bg-island-hover focus-visible:ring-ring focus-visible:ring-offset-page flex flex-col rounded-lg p-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

export const tileStageClassName = 'relative min-h-0 flex-1 overflow-hidden rounded-md';

export const tileFooterClassName =
  'flex h-12 shrink-0 items-center gap-2 px-3 text-[15px] font-medium';

export function TileArrow({ className }: { className?: string }) {
  return (
    <ArrowUpRightIcon
      size={16}
      aria-hidden="true"
      className={cn(
        'text-brand-text shrink-0 transition-transform duration-200 ease-out group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 motion-reduce:transform-none rtl:-scale-x-100',
        className,
      )}
    />
  );
}
