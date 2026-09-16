import * as React from 'react';

export type HistoryIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function HistoryIcon({ size = 24, strokeWidth = 1.5, ...props }: HistoryIconProps) {
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
      <path d="M3 12a9 9 0 1 0 2.6-6.4" />
      <path d="M2.5 3.5v4.5H7" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
