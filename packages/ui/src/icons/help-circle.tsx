import * as React from 'react';

export type HelpCircleIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function HelpCircleIcon({ size = 24, strokeWidth = 1.5, ...props }: HelpCircleIconProps) {
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
      <path d="M9.3 9.3a2.8 2.8 0 1 1 3.9 2.6c-.8.4-1.2 1-1.2 1.9" />
      <path d="M12 17h.01" />
    </svg>
  );
}
