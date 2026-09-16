import * as React from 'react';

export type RouteIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function RouteIcon({ size = 24, strokeWidth = 1.5, ...props }: RouteIconProps) {
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
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19h6a3 3 0 0 0 0-6h-5a3 3 0 0 1 0-6h6" />
    </svg>
  );
}
