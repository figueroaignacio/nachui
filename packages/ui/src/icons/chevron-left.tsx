import * as React from 'react';

export type ChevronLeftIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ChevronLeftIcon({ size = 24, strokeWidth = 1.5, ...props }: ChevronLeftIconProps) {
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
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}
