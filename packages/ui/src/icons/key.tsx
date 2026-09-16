import * as React from 'react';

export type KeyIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function KeyIcon({ size = 24, strokeWidth = 1.5, ...props }: KeyIconProps) {
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
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m10.7 12.3 8.3-8.3 2.5 2.5" />
      <path d="m15.5 7.5 2.5 2.5" />
    </svg>
  );
}
