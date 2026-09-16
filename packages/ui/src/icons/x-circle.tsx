import * as React from 'react';

export type XCircleIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function XCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: XCircleIconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
