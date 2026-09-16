import * as React from 'react';

export type UserPlusIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function UserPlusIcon({ size = 24, strokeWidth = 1.5, ...props }: UserPlusIconProps) {
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
      <circle cx="10" cy="7.5" r="4" />
      <path d="M2.5 20.5c0-3.3 3.4-6 7.5-6s7.5 2.7 7.5 6h-15Z" />
      <path d="M19 7.5v6" />
      <path d="M16 10.5h6" />
    </svg>
  );
}
