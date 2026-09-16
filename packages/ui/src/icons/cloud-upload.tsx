import * as React from 'react';

export type CloudUploadIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function CloudUploadIcon({ size = 24, strokeWidth = 1.5, ...props }: CloudUploadIconProps) {
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
      <path d="M7.5 18.5A4.5 4.5 0 0 1 6.9 9.5 6 6 0 0 1 18.4 8.2a4 4 0 0 1-.9 7.9" />
      <path d="M12 12.5V21" />
      <path d="m8.5 16 3.5-3.5 3.5 3.5" />
    </svg>
  );
}
