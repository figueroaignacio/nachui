import * as React from 'react';

export type MegaphoneIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function MegaphoneIcon({ size = 24, strokeWidth = 1.5, ...props }: MegaphoneIconProps) {
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
      <path d="M3 10v4a1 1 0 0 0 1 1h3l9 4V5L7 9H4a1 1 0 0 0-1 1Z" />
      <path d="M19 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M7 15v4a1 1 0 0 0 1 1h2" />
    </svg>
  );
}
