import * as React from 'react';

export type ChevronUpIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ChevronUpIcon({ size = 24, strokeWidth = 1.5, ...props }: ChevronUpIconProps) {
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
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}
