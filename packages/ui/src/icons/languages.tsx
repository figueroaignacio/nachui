import * as React from 'react';

export type LanguagesIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function LanguagesIcon({ size = 24, strokeWidth = 1.5, ...props }: LanguagesIconProps) {
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
      <path d="M3 5h10" />
      <path d="M8 3v2" />
      <path d="M11 5c-.8 3.5-3 6.5-6 8.5" />
      <path d="M5.5 8.5c1 2.5 3 4.5 5.5 5.5" />
      <path d="m13 21 4-9 4 9" />
      <path d="M14.3 18h5.4" />
    </svg>
  );
}
