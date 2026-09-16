import * as React from 'react';

export type SendIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SendIcon({ size = 24, strokeWidth = 1.5, ...props }: SendIconProps) {
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
      <path d="M20.5 3.5 10.2 13.8" />
      <path d="m20.5 3.5-6.5 17a.5.5 0 0 1-.9 0l-3-7.3-7.3-3a.5.5 0 0 1 0-.9l17-6.5a.5.5 0 0 1 .7.7Z" />
    </svg>
  );
}
