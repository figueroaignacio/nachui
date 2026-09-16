import * as React from 'react';

export type SeparatorHorizontalIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SeparatorHorizontalIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: SeparatorHorizontalIconProps) {
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
      <path d="M3 12h18" />
      <path d="m8 7 4-4 4 4" />
      <path d="m8 17 4 4 4-4" />
    </svg>
  );
}
