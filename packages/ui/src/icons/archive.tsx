import * as React from 'react';

export type ArchiveIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ArchiveIcon({ size = 24, strokeWidth = 1.5, ...props }: ArchiveIconProps) {
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
      <rect x="2.5" y="3.5" width="19" height="5.5" rx="2" />
      <path d="M4 9v8.5a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9" />
      <path d="M10 13.5h4" />
    </svg>
  );
}
