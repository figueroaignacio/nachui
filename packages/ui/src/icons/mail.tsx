import * as React from 'react';

export type MailIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function MailIcon({ size = 24, strokeWidth = 1.5, ...props }: MailIconProps) {
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
      <path d="m6.5 9 4 2.7a2.5 2.5 0 0 0 3 0l4-2.7" />
    </svg>
  );
}
