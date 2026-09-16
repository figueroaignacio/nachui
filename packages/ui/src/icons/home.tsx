import * as React from 'react';

export type HomeIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function HomeIcon({ size = 24, strokeWidth = 1.5, ...props }: HomeIconProps) {
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
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10v8.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V10" />
      <path d="M9.5 20.5v-5a2.5 2.5 0 0 1 5 0v5" />
    </svg>
  );
}
