import * as React from 'react';

export type ImagePlusIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ImagePlusIcon({ size = 24, strokeWidth = 1.5, ...props }: ImagePlusIconProps) {
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
      <path d="M21.5 12.5v4.5a3.5 3.5 0 0 1-3.5 3.5H6a3.5 3.5 0 0 1-3.5-3.5V7A3.5 3.5 0 0 1 6 3.5h6.5" />
      <circle cx="8.5" cy="9" r="2" />
      <path d="m21.5 14.5-3.4-3.4a2 2 0 0 0-2.8 0L7 19.4" />
      <path d="M18.5 2.5v6" />
      <path d="M15.5 5.5h6" />
    </svg>
  );
}
