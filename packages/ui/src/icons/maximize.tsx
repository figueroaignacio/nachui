import * as React from 'react';

export type MaximizeIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function MaximizeIcon({ size = 24, strokeWidth = 1.5, ...props }: MaximizeIconProps) {
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
      <path d="M14 4h6v6" />
      <path d="M10 20H4v-6" />
      <path d="m20 4-6 6" />
      <path d="m4 20 6-6" />
    </svg>
  );
}
