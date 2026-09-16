import * as React from 'react';

export type ArrowLeftIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ArrowLeftIcon({ size = 24, strokeWidth = 1.5, ...props }: ArrowLeftIconProps) {
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
      <path d="M20 12H4" />
      <path d="m11 5-7 7 7 7" />
    </svg>
  );
}
