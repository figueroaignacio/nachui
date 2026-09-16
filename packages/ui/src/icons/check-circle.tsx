import * as React from 'react';

export type CheckCircleIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CheckCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: CheckCircleIconProps) {
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
      <path d="m8 12 2.7 2.7L16 9.3" />
    </svg>
  );
}
