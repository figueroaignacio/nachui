import * as React from 'react';

export type CheckIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CheckIcon({ size = 24, strokeWidth = 1.5, ...props }: CheckIconProps) {
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
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}
