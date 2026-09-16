import * as React from 'react';

export type CheckSquareIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CheckSquareIcon({ size = 24, strokeWidth = 1.5, ...props }: CheckSquareIconProps) {
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
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}
