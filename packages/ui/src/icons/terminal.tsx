import * as React from 'react';

export type TerminalIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function TerminalIcon({ size = 24, strokeWidth = 1.5, ...props }: TerminalIconProps) {
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
      <rect x="2.5" y="4" width="19" height="16" rx="3.5" />
      <path d="m7 9.5 3 2.5-3 2.5" />
      <path d="M12.5 14.5H17" />
    </svg>
  );
}
