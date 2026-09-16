import * as React from 'react';

export type TagIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function TagIcon({ size = 24, strokeWidth = 1.5, ...props }: TagIconProps) {
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
      <path d="M3 5a2 2 0 0 1 2-2h5.2a2 2 0 0 1 1.4.6l8.8 8.8a2 2 0 0 1 0 2.8l-5.2 5.2a2 2 0 0 1-2.8 0L3.6 11.6A2 2 0 0 1 3 10.2V5Z" />
      <path d="M7.5 7.5h.01" />
    </svg>
  );
}
