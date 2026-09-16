import * as React from 'react';

export type GamepadIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function GamepadIcon({ size = 24, strokeWidth = 1.5, ...props }: GamepadIconProps) {
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
      <rect x="2.5" y="6.5" width="19" height="11.5" rx="4.5" />
      <path d="M7 10.5v3" />
      <path d="M5.5 12h3" />
      <path d="M15.5 10.75h.01" />
      <path d="M18 13.25h.01" />
    </svg>
  );
}
