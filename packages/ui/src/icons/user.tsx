import * as React from 'react';

export type UserIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function UserIcon({ size = 24, strokeWidth = 1.5, ...props }: UserIconProps) {
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
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4.5 20.5c0-3.3 3.4-6 7.5-6s7.5 2.7 7.5 6H4.5Z" />
    </svg>
  );
}
