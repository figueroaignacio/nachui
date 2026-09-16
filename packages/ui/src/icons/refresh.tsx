import * as React from 'react';

export type RefreshIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function RefreshIcon({ size = 24, strokeWidth = 1.5, ...props }: RefreshIconProps) {
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
      <path d="M2.5 12a9.5 9.5 0 0 1 16.3-6.6L21 7.5" />
      <path d="M21 2.5v5h-5" />
      <path d="M21.5 12a9.5 9.5 0 0 1-16.3 6.6L3 16.5" />
      <path d="M3 21.5v-5h5" />
    </svg>
  );
}
