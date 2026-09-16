import * as React from 'react';

export type RocketIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function RocketIcon({ size = 24, strokeWidth = 1.5, ...props }: RocketIconProps) {
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
      <path d="M12 2.5c3.3 2.2 5 5.8 5 10v3.5a1 1 0 0 1-.6.9L12 19l-4.4-2.1a1 1 0 0 1-.6-.9V12.5c0-4.2 1.7-7.8 5-10Z" />
      <path d="M7 13 3.7 15.4a1 1 0 0 0-.2 1.4L5.5 19l1.5-.5" />
      <path d="m17 13 3.3 2.4a1 1 0 0 1 .2 1.4L18.5 19 17 18.5" />
      <path d="M10 19v1.5l2 1.5 2-1.5V19" />
      <circle cx="12" cy="10" r="1.75" />
    </svg>
  );
}
