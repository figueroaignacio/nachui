import * as React from 'react';

export type GaugeIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function GaugeIcon({ size = 24, strokeWidth = 1.5, ...props }: GaugeIconProps) {
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
      <path d="M3.5 15a9 9 0 1 1 17 0" />
      <path d="m12 15 4-5" />
      <circle cx="12" cy="15" r="1" />
    </svg>
  );
}
