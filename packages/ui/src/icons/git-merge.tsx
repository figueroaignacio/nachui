import * as React from 'react';

export type GitMergeIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function GitMergeIcon({ size = 24, strokeWidth = 1.5, ...props }: GitMergeIconProps) {
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
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M6 7.5v9" />
      <path d="M6 7.5a8 8 0 0 0 8 4.5h1.5" />
    </svg>
  );
}
