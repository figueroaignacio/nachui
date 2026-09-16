import * as React from 'react';

export type ChevronsDownUpIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ChevronsDownUpIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: ChevronsDownUpIconProps) {
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
      <path d="m7 20 5-5 5 5" />
      <path d="m7 4 5 5 5-5" />
    </svg>
  );
}
