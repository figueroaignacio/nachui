import * as React from 'react';

export type WandIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function WandIcon({ size = 24, strokeWidth = 1.5, ...props }: WandIconProps) {
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
      <path d="m3 21 11-11" />
      <path d="m11.5 7.5 5 5" />
      <path d="M17 3v2.5" />
      <path d="M21 7h-2.5" />
      <path d="m20 4-1.5 1.5" />
      <path d="m14 4 1.5 1.5" />
      <path d="m20 10-1.5-1.5" />
    </svg>
  );
}
