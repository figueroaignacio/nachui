import * as React from 'react';

export type RepeatIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function RepeatIcon({ size = 24, strokeWidth = 1.5, ...props }: RepeatIconProps) {
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
      <path d="m17 3 3 3-3 3" />
      <path d="M20 6H8a4 4 0 0 0-4 4v1" />
      <path d="m7 21-3-3 3-3" />
      <path d="M4 18h12a4 4 0 0 0 4-4v-1" />
    </svg>
  );
}
