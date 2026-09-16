import * as React from 'react';

export type ArrowDownIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ArrowDownIcon({ size = 24, strokeWidth = 1.5, ...props }: ArrowDownIconProps) {
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
      <path d="M12 4v16" />
      <path d="m19 13-7 7-7-7" />
    </svg>
  );
}
