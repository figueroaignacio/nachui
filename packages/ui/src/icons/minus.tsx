import * as React from 'react';

export type MinusIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function MinusIcon({ size = 24, strokeWidth = 1.5, ...props }: MinusIconProps) {
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
      <path d="M5 12h14" />
    </svg>
  );
}
