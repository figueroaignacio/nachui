import * as React from 'react';

export type ShieldIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ShieldIcon({ size = 24, strokeWidth = 1.5, ...props }: ShieldIconProps) {
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
      <path d="M12 2.5 5 5.2a1 1 0 0 0-.6.9V11c0 5 3.2 8.6 7.2 10.3a1 1 0 0 0 .8 0c4-1.7 7.2-5.3 7.2-10.3V6.1a1 1 0 0 0-.6-.9L12 2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
