import * as React from 'react';

export type MusicIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function MusicIcon({ size = 24, strokeWidth = 1.5, ...props }: MusicIconProps) {
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
      <circle cx="6.5" cy="17.5" r="3" />
      <circle cx="17.5" cy="15.5" r="3" />
      <path d="M9.5 17.5V7.2a2 2 0 0 1 1.5-1.9l8-2a2 2 0 0 1 1.5 1.9v10.3" />
    </svg>
  );
}
