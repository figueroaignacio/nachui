import * as React from 'react';

export type XIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function XIcon({ size = 24, strokeWidth = 1.5, ...props }: XIconProps) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
