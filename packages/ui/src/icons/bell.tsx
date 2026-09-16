import * as React from 'react';

export type BellIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function BellIcon({ size = 24, strokeWidth = 1.5, ...props }: BellIconProps) {
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
      <path d="M6.5 16.5v-6a5.5 5.5 0 0 1 11 0v6l1.3 1.5c.4.5.1 1.3-.6 1.3H5.8c-.7 0-1-.8-.6-1.3L6.5 16.5Z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
      <path d="M12 4.5V3" />
    </svg>
  );
}
