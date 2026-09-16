import * as React from 'react';

export type LayoutGridIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function LayoutGridIcon({ size = 24, strokeWidth = 1.5, ...props }: LayoutGridIconProps) {
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
      <rect x="2.5" y="2.5" width="7.5" height="7.5" rx="2" />
      <rect x="14" y="2.5" width="7.5" height="7.5" rx="2" />
      <rect x="2.5" y="14" width="7.5" height="7.5" rx="2" />
      <rect x="14" y="14" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}
