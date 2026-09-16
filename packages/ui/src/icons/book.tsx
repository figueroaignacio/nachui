import * as React from 'react';

export type BookIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function BookIcon({ size = 24, strokeWidth = 1.5, ...props }: BookIconProps) {
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
      <path d="M4.5 19.5V5A2.5 2.5 0 0 1 7 2.5h11a1.5 1.5 0 0 1 1.5 1.5v12.5" />
      <path d="M7 16.5h12.5v5H7a2.5 2.5 0 0 1 0-5Z" />
    </svg>
  );
}
