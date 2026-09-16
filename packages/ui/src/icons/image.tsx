import * as React from 'react';

export type ImageIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ImageIcon({ size = 24, strokeWidth = 1.5, ...props }: ImageIconProps) {
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
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" />
      <circle cx="8.5" cy="9" r="2" />
      <path d="m21.5 14.5-3.4-3.4a2 2 0 0 0-2.8 0L7 19.4" />
    </svg>
  );
}
