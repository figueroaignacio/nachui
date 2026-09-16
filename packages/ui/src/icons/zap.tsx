import * as React from 'react';

export type ZapIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ZapIcon({ size = 24, strokeWidth = 1.5, ...props }: ZapIconProps) {
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
      <path d="M13.6 2.5 4.8 12.6a.8.8 0 0 0 .6 1.3H11l-.9 7.6 8.9-10.1a.8.8 0 0 0-.6-1.3H13l.6-7.6Z" />
    </svg>
  );
}
