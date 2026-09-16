import * as React from 'react';

export type LayersIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function LayersIcon({ size = 24, strokeWidth = 1.5, ...props }: LayersIconProps) {
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
      <path d="m10.8 3.6-6.6 3.3c-1.6.8-1.6 1.4 0 2.2l6.6 3.3c.8.4 1.6.4 2.4 0l6.6-3.3c1.6-.8 1.6-1.4 0-2.2l-6.6-3.3c-.8-.4-1.6-.4-2.4 0Z" />
      <path d="m3.5 12 7.3 3.7c.8.4 1.6.4 2.4 0l7.3-3.7" />
      <path d="m3.5 16 7.3 3.7c.8.4 1.6.4 2.4 0l7.3-3.7" />
    </svg>
  );
}
