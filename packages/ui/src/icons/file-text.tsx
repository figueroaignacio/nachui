import * as React from 'react';

export type FileTextIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function FileTextIcon({ size = 24, strokeWidth = 1.5, ...props }: FileTextIconProps) {
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
      <path d="M13.5 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8.5L13.5 3Z" />
      <path d="M13.5 3v3.5a2 2 0 0 0 2 2H19" />
      <path d="M8.5 13h7" />
      <path d="M8.5 17h4" />
    </svg>
  );
}
