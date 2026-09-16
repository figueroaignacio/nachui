import * as React from 'react';

export type FrameIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function FrameIcon({ size = 24, strokeWidth = 1.5, ...props }: FrameIconProps) {
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
      <path d="M3 7h18" />
      <path d="M3 17h18" />
      <path d="M7 3v18" />
      <path d="M17 3v18" />
    </svg>
  );
}
