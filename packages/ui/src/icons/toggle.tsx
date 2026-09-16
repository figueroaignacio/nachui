import * as React from 'react';

export type ToggleIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ToggleIcon({ size = 24, strokeWidth = 1.5, ...props }: ToggleIconProps) {
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
      <rect x="2.5" y="6.5" width="19" height="11" rx="5.5" />
      <circle cx="16" cy="12" r="2.75" />
    </svg>
  );
}
