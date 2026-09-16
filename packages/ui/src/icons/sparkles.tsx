import * as React from 'react';

export type SparklesIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SparklesIcon({ size = 24, strokeWidth = 1.5, ...props }: SparklesIconProps) {
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
      <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
      <path d="M19 15c.3 2.2 1 2.9 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3Z" />
      <path d="M5 2.5c.2 1.6.7 2.1 2 2.3-1.3.2-1.8.7-2 2.3-.2-1.6-.7-2.1-2-2.3 1.3-.2 1.8-.7 2-2.3Z" />
    </svg>
  );
}
