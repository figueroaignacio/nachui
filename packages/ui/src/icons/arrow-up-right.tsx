import * as React from 'react';

export type ArrowUpRightIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ArrowUpRightIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: ArrowUpRightIconProps) {
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
      <path d="M6 18 18 6" />
      <path d="M8 6h10v10" />
    </svg>
  );
}
