import * as React from 'react';

export type EyeIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function EyeIcon({ size = 24, strokeWidth = 1.5, ...props }: EyeIconProps) {
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
      <path d="M2.5 12c2-4.3 5.3-6.5 9.5-6.5s7.5 2.2 9.5 6.5c-2 4.3-5.3 6.5-9.5 6.5S4.5 16.3 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
