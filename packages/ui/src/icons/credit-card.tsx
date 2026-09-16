import * as React from 'react';

export type CreditCardIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CreditCardIcon({ size = 24, strokeWidth = 1.5, ...props }: CreditCardIconProps) {
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
      <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" />
      <path d="M2.5 9.5h19" />
      <path d="M6.5 15h3" />
      <path d="M13.5 15h4" />
    </svg>
  );
}
