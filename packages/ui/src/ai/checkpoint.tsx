import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function FlagIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}

interface CheckpointProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  restoreLabel?: string;
  onRestore?: () => void;
  icon?: React.ReactNode;
}

const Checkpoint = ({
  className,
  label = 'Checkpoint',
  restoreLabel = 'Restore',
  onRestore,
  icon,
  children,
  ref,
  ...props
}: CheckpointProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={typeof label === 'string' ? label : undefined}
      data-slot="checkpoint"
      className={cn('text-muted-foreground flex items-center gap-3 py-1 text-xs', className)}
      {...props}
    >
      <span aria-hidden="true" className="bg-border h-px flex-1" />
      <span className="flex shrink-0 items-center gap-1.5">
        <span aria-hidden="true" className="flex [&>svg]:size-3.5">
          {icon ?? <FlagIcon />}
        </span>
        <span>{label}</span>
        {children}
        {onRestore ? (
          <button
            type="button"
            onClick={onRestore}
            data-slot="checkpoint-restore"
            className="text-foreground decoration-border-interactive hover:decoration-foreground focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {restoreLabel}
          </button>
        ) : null}
      </span>
      <span aria-hidden="true" className="bg-border h-px flex-1" />
    </div>
  );
};

Checkpoint.displayName = 'Checkpoint';

export { Checkpoint };
export type { CheckpointProps };
