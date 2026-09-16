import * as React from 'react';

export type BrowserIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function BrowserIcon({ size = 24, strokeWidth = 1.5, ...props }: BrowserIconProps) {
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
      <rect x="2.5" y="4" width="19" height="16" rx="3.5" />
      <path d="M2.5 9.5h19" />
      <path d="M6.5 6.75h.01" />
      <path d="M9.5 6.75h.01" />
    </svg>
  );
}
