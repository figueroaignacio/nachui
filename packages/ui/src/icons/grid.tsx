import * as React from 'react';

export type GridIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function GridIcon({ size = 24, strokeWidth = 1.5, ...props }: GridIconProps) {
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
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
      <path d="M2.5 9h19" />
      <path d="M2.5 15h19" />
      <path d="M9 2.5v19" />
      <path d="M15 2.5v19" />
    </svg>
  );
}
