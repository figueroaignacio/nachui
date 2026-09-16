import * as React from 'react';

export type NavigationIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function NavigationIcon({ size = 24, strokeWidth = 1.5, ...props }: NavigationIconProps) {
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
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
    </svg>
  );
}
