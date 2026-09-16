import * as React from 'react';

export type ClockIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ClockIcon({ size = 24, strokeWidth = 1.5, ...props }: ClockIconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
