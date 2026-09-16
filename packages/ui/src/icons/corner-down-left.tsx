import * as React from 'react';

export type CornerDownLeftIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CornerDownLeftIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: CornerDownLeftIconProps) {
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
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
      <path d="m9 10-5 5 5 5" />
    </svg>
  );
}
