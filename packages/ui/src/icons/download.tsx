import * as React from 'react';

export type DownloadIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function DownloadIcon({ size = 24, strokeWidth = 1.5, ...props }: DownloadIconProps) {
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
      <path d="M12 3v11" />
      <path d="m8 10.5 4 4 4-4" />
      <path d="M3.5 15v1.5A3.5 3.5 0 0 0 7 20h10a3.5 3.5 0 0 0 3.5-3.5V15" />
    </svg>
  );
}
