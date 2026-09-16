import * as React from 'react';

export type CodeIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CodeIcon({ size = 24, strokeWidth = 1.5, ...props }: CodeIconProps) {
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
      <path d="m7.5 8-4 4 4 4" />
      <path d="m16.5 8 4 4-4 4" />
      <path d="m14 5-4 14" />
    </svg>
  );
}
