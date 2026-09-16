import * as React from 'react';

export type HeartIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function HeartIcon({ size = 24, strokeWidth = 1.5, ...props }: HeartIconProps) {
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
      <path d="M12 20.5c-.5 0-1-.2-1.4-.5C7 17.2 3 13.8 3 9.5 3 6.7 5.2 4.5 8 4.5c1.6 0 3.1.8 4 2 .9-1.2 2.4-2 4-2 2.8 0 5 2.2 5 5 0 4.3-4 7.7-7.6 10.5-.4.3-.9.5-1.4.5Z" />
    </svg>
  );
}
