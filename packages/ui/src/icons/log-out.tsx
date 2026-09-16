import * as React from 'react';

export type LogOutIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function LogOutIcon({ size = 24, strokeWidth = 1.5, ...props }: LogOutIconProps) {
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
      <path d="M10 21H7a3.5 3.5 0 0 1-3.5-3.5v-11A3.5 3.5 0 0 1 7 3h3" />
      <path d="m16 8 4 4-4 4" />
      <path d="M20 12H9" />
    </svg>
  );
}
