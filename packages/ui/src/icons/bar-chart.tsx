import * as React from 'react';

export type BarChartIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function BarChartIcon({ size = 24, strokeWidth = 1.5, ...props }: BarChartIconProps) {
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
      <rect x="4" y="11" width="4" height="9" rx="1.5" />
      <rect x="10" y="4" width="4" height="16" rx="1.5" />
      <rect x="16" y="8" width="4" height="12" rx="1.5" />
    </svg>
  );
}
