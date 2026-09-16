import * as React from 'react';

export type PaperclipIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function PaperclipIcon({ size = 24, strokeWidth = 1.5, ...props }: PaperclipIconProps) {
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
      <path d="m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.3 3.3 0 0 1 4.7 4.7L9.5 17a1.7 1.7 0 0 1-2.4-2.4L15 6.7" />
    </svg>
  );
}
