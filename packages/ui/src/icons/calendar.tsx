import * as React from 'react';

export type CalendarIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CalendarIcon({ size = 24, strokeWidth = 1.5, ...props }: CalendarIconProps) {
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
      <rect x="2.5" y="4" width="19" height="17" rx="3.5" />
      <path d="M2.5 9.5h19" />
      <path d="M7.5 2.5v3" />
      <path d="M16.5 2.5v3" />
      <path d="M7.5 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16.5 14h.01" />
      <path d="M7.5 17.5h.01" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}
