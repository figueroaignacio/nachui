import * as React from 'react';

export type EyeOffIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function EyeOffIcon({ size = 24, strokeWidth = 1.5, ...props }: EyeOffIconProps) {
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
      <path d="m3 3 18 18" />
      <path d="M10.5 5.7c.5-.1 1-.2 1.5-.2 4.2 0 7.5 2.2 9.5 6.5a13.6 13.6 0 0 1-2.4 3.4" />
      <path d="M6.5 6.6C4.7 7.9 3.4 9.7 2.5 12c2 4.3 5.3 6.5 9.5 6.5 1.5 0 2.8-.3 4-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
