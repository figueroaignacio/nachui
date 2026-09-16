import * as React from 'react';

export type TrashIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function TrashIcon({ size = 24, strokeWidth = 1.5, ...props }: TrashIconProps) {
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
      <path d="M4 6.5h16" />
      <path d="m6 6.5.8 11.6A3 3 0 0 0 9.8 21h4.4a3 3 0 0 0 3-2.9L18 6.5" />
      <path d="M9 6.5V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
