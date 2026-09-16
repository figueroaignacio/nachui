import * as React from 'react';

export type LockIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function LockIcon({ size = 24, strokeWidth = 1.5, ...props }: LockIconProps) {
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
      <rect x="4" y="10.5" width="16" height="11" rx="3" />
      <path d="M8 10.5v-3a4 4 0 0 1 8 0v3" />
      <path d="M12 15v2" />
    </svg>
  );
}
