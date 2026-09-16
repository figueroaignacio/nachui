import * as React from 'react';

export type ChevronRightIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ChevronRightIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: ChevronRightIconProps) {
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
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
