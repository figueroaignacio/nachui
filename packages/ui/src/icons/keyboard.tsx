import * as React from 'react';

export type KeyboardIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function KeyboardIcon({ size = 24, strokeWidth = 1.5, ...props }: KeyboardIconProps) {
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
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M6.5 9.5h.01" />
      <path d="M10 9.5h.01" />
      <path d="M14 9.5h.01" />
      <path d="M17.5 9.5h.01" />
      <path d="M8 14.5h8" />
    </svg>
  );
}
