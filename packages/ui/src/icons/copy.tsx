import * as React from 'react';

export type CopyIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CopyIcon({ size = 24, strokeWidth = 1.5, ...props }: CopyIconProps) {
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
      <rect x="8.5" y="8.5" width="12.5" height="12.5" rx="3" />
      <path d="M5.5 15.5h-.5a2.5 2.5 0 0 1-2.5-2.5V5.5A2.5 2.5 0 0 1 5 3h7.5A2.5 2.5 0 0 1 15 5.5V6" />
    </svg>
  );
}
