import * as React from 'react';

export type DistributeHorizontalIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function DistributeHorizontalIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: DistributeHorizontalIconProps) {
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
      <path d="M4 3v18" />
      <path d="M20 3v18" />
      <rect x="9" y="8" width="6" height="8" rx="1" />
    </svg>
  );
}
