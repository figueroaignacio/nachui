import * as React from 'react';

export type InboxIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function InboxIcon({ size = 24, strokeWidth = 1.5, ...props }: InboxIconProps) {
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
      <path d="M3 13.5h4.3a1 1 0 0 1 .9.5l.7 1.5a1 1 0 0 0 .9.5h4.4a1 1 0 0 0 .9-.5l.7-1.5a1 1 0 0 1 .9-.5H21" />
      <path d="M6 4.5h12a3 3 0 0 1 2.9 2.4L21 12v5.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V12l.1-5.1A3 3 0 0 1 6 4.5Z" />
    </svg>
  );
}
