import * as React from 'react';

export type SearchIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SearchIcon({ size = 24, strokeWidth = 1.5, ...props }: SearchIconProps) {
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
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="m21 21-4.6-4.6" />
    </svg>
  );
}
