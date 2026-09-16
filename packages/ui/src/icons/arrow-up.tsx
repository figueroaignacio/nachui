import * as React from 'react';

export type ArrowUpIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ArrowUpIcon({ size = 24, strokeWidth = 1.5, ...props }: ArrowUpIconProps) {
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
      <path d="M12 20V4" />
      <path d="m5 11 7-7 7 7" />
    </svg>
  );
}
