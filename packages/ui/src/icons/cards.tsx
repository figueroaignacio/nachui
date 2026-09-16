import * as React from 'react';

export type CardsIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CardsIcon({ size = 24, strokeWidth = 1.5, ...props }: CardsIconProps) {
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
      <rect x="2.5" y="6.5" width="14.5" height="14.5" rx="3" />
      <path d="M7 6.5V6a3 3 0 0 1 3-3h8.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H17" />
    </svg>
  );
}
