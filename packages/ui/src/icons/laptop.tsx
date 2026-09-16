import * as React from 'react';

export type LaptopIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function LaptopIcon({ size = 24, strokeWidth = 1.5, ...props }: LaptopIconProps) {
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
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="3" />
      <path d="M2 19.5h20" />
    </svg>
  );
}
