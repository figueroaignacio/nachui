import * as React from 'react';

export type RectangleIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function RectangleIcon({ size = 24, strokeWidth = 1.5, ...props }: RectangleIconProps) {
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
      <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
    </svg>
  );
}
