import * as React from 'react';

export type VideoIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function VideoIcon({ size = 24, strokeWidth = 1.5, ...props }: VideoIconProps) {
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
      <rect x="2.5" y="5.5" width="13" height="13" rx="3" />
      <path d="m15.5 10 4.4-2.6a1 1 0 0 1 1.6.9v7.4a1 1 0 0 1-1.6.9L15.5 14" />
    </svg>
  );
}
