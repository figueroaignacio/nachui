import * as React from 'react';

export type UsersIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function UsersIcon({ size = 24, strokeWidth = 1.5, ...props }: UsersIconProps) {
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
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M3 20.5c0-3 2.9-5.5 6.5-5.5s6.5 2.5 6.5 5.5H3Z" />
      <path d="M15.5 4.3a3.5 3.5 0 0 1 0 6.4" />
      <path d="M17.5 15.3c2.1.6 3.5 2.4 3.5 4.7v.5h-2" />
    </svg>
  );
}
