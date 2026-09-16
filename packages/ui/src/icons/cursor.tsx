import * as React from 'react';

export type CursorIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CursorIcon({ size = 24, strokeWidth = 1.5, ...props }: CursorIconProps) {
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
      <path d="M4.5 3.5 19 10.2l-6.2 1.8-2.6 6L4.5 3.5Z" />
    </svg>
  );
}
