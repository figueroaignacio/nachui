import * as React from 'react';

export type StarIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function StarIcon({ size = 24, strokeWidth = 1.5, ...props }: StarIconProps) {
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
      <path d="M10.9 3.6c.4-.9 1.8-.9 2.2 0l1.9 4.2 4.5.5c1 .1 1.4 1.3.7 2l-3.4 3.1.9 4.5c.2 1-.9 1.8-1.7 1.3L12 16.9l-4 2.3c-.8.5-1.9-.3-1.7-1.3l.9-4.5-3.4-3.1c-.7-.7-.3-1.9.7-2l4.5-.5 1.9-4.2Z" />
    </svg>
  );
}
