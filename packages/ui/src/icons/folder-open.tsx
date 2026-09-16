import * as React from 'react';

export type FolderOpenIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function FolderOpenIcon({ size = 24, strokeWidth = 1.5, ...props }: FolderOpenIconProps) {
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
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.4a2.5 2.5 0 0 1 2 1l1.2 1.5h6.4A2.5 2.5 0 0 1 21 10v1" />
      <path d="M3 17.5v-10" />
      <path d="M5.2 20h12.6a2 2 0 0 0 1.9-1.4l1.6-5a1.5 1.5 0 0 0-1.4-2H7.4a2 2 0 0 0-1.9 1.4L3.4 18a1.5 1.5 0 0 0 1.8 2Z" />
    </svg>
  );
}
