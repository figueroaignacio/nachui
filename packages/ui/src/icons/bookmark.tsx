import * as React from 'react';

export type BookmarkIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function BookmarkIcon({ size = 24, strokeWidth = 1.5, ...props }: BookmarkIconProps) {
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
      <path d="M5 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v13.7a1 1 0 0 1-1.5.8L12 16.5l-5.5 4a1 1 0 0 1-1.5-.8V6Z" />
    </svg>
  );
}
