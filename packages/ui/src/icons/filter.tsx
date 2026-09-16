import * as React from 'react';

export type FilterIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function FilterIcon({ size = 24, strokeWidth = 1.5, ...props }: FilterIconProps) {
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
      <path d="M4.5 4h15a1 1 0 0 1 .8 1.6L14.5 13v5.5a1 1 0 0 1-.5.9l-3 1.5a1 1 0 0 1-1.5-.9V13L3.7 5.6A1 1 0 0 1 4.5 4Z" />
    </svg>
  );
}
