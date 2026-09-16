import * as React from 'react';

export type UserCircleIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function UserCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: UserCircleIconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M5.5 18.6c1.2-2.4 3.6-3.9 6.5-3.9s5.3 1.5 6.5 3.9" />
    </svg>
  );
}
