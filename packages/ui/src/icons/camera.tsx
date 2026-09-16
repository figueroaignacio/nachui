import * as React from 'react';

export type CameraIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CameraIcon({ size = 24, strokeWidth = 1.5, ...props }: CameraIconProps) {
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
      <path d="M3 10a3 3 0 0 1 3-3h1.2a2 2 0 0 0 1.6-.8l.9-1.2a2 2 0 0 1 1.6-.8h1.4a2 2 0 0 1 1.6.8l.9 1.2a2 2 0 0 0 1.6.8H18a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V10Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}
