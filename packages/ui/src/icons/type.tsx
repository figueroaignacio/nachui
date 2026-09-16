import * as React from 'react';

export type TypeIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function TypeIcon({ size = 24, strokeWidth = 1.5, ...props }: TypeIconProps) {
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
      <path d="M5 7V4h14v3" />
      <path d="M12 4v16" />
      <path d="M9 20h6" />
    </svg>
  );
}
