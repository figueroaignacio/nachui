import * as React from 'react';

export type PuzzleIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function PuzzleIcon({ size = 24, strokeWidth = 1.5, ...props }: PuzzleIconProps) {
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
      <path d="M10 3.5a2 2 0 0 1 4 0V5h3a1 1 0 0 1 1 1v3h1.5a2 2 0 0 1 0 4H18v3a1 1 0 0 1-1 1h-3v1.5a2 2 0 0 1-4 0V17H7a1 1 0 0 1-1-1v-3H4.5a2 2 0 0 1 0-4H6V6a1 1 0 0 1 1-1h3V3.5Z" />
    </svg>
  );
}
