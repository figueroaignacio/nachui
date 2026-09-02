import React from 'react';
import { cn } from '../lib/cn';

const SPACER_SIZES = {
  vertical: {
    '1': 'h-1',
    '2': 'h-2',
    '3': 'h-3',
    '4': 'h-4',
    '5': 'h-5',
    '6': 'h-6',
    '8': 'h-8',
    '10': 'h-10',
    '12': 'h-12',
    '16': 'h-16',
    '20': 'h-20',
    '24': 'h-24',
    '32': 'h-32',
  },
  horizontal: {
    '1': 'w-1',
    '2': 'w-2',
    '3': 'w-3',
    '4': 'w-4',
    '5': 'w-5',
    '6': 'w-6',
    '8': 'w-8',
    '10': 'w-10',
    '12': 'w-12',
    '16': 'w-16',
    '20': 'w-20',
    '24': 'w-24',
    '32': 'w-32',
  },
} as const;

type SpacerSize = keyof typeof SPACER_SIZES.vertical;
type SpacerAxis = keyof typeof SPACER_SIZES;

interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: SpacerSize;
  axis?: SpacerAxis;
}

const Spacer = ({
  as: Component = 'div',
  size,
  axis = 'vertical',
  className,
  ref,
  ...props
}: SpacerProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <Component
      ref={ref}
      aria-hidden="true"
      data-slot="spacer"
      data-axis={axis}
      className={cn(
        'shrink-0',
        size ? SPACER_SIZES[axis][size] : 'flex-1 self-stretch',
        axis === 'horizontal' && !size && 'inline-block',
        className,
      )}
      {...props}
    />
  );
};

Spacer.displayName = 'Spacer';

export { Spacer };
export type { SpacerProps, SpacerSize, SpacerAxis };
