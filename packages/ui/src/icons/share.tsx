import * as React from 'react';

export type ShareIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ShareIcon({ size = 24, strokeWidth = 1.5, ...props }: ShareIconProps) {
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
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.6" />
      <path d="m8.2 13.2 7.6 4.6" />
    </svg>
  );
}
