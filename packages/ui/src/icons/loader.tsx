import * as React from 'react';

export type LoaderIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function LoaderIcon({ size = 24, strokeWidth = 1.5, ...props }: LoaderIconProps) {
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
      <path d="M21.5 12A9.5 9.5 0 1 1 12 2.5" />
    </svg>
  );
}
