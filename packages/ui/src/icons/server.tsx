import * as React from 'react';

export type ServerIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ServerIcon({ size = 24, strokeWidth = 1.5, ...props }: ServerIconProps) {
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
      <rect x="2.5" y="3" width="19" height="7.5" rx="3" />
      <rect x="2.5" y="13.5" width="19" height="7.5" rx="3" />
      <path d="M6.5 6.75h.01" />
      <path d="M10 6.75h.01" />
      <path d="M6.5 17.25h.01" />
      <path d="M10 17.25h.01" />
    </svg>
  );
}
