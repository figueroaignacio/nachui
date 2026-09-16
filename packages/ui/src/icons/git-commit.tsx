import * as React from 'react';

export type GitCommitIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function GitCommitIcon({ size = 24, strokeWidth = 1.5, ...props }: GitCommitIconProps) {
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
      <circle cx="12" cy="12" r="3.5" />
      <path d="M2.5 12h6" />
      <path d="M15.5 12h6" />
    </svg>
  );
}
