import * as React from 'react';

export type FolderIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function FolderIcon({ size = 24, strokeWidth = 1.5, ...props }: FolderIconProps) {
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
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.4a2.5 2.5 0 0 1 2 1l1.2 1.5h6.4A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
      <path d="M3 10.5h18" />
    </svg>
  );
}
