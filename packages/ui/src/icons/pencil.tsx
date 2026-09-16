import * as React from 'react';

export type PencilIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function PencilIcon({ size = 24, strokeWidth = 1.5, ...props }: PencilIconProps) {
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
      <path d="m14.5 5.5 4 4" />
      <path d="M17.3 3.7a2.5 2.5 0 0 1 3.5 3.5L9 19l-5 1 1-5L17.3 3.7Z" />
    </svg>
  );
}
