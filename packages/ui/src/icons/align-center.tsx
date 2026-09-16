import * as React from 'react';

export type AlignCenterIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function AlignCenterIcon({ size = 24, strokeWidth = 1.5, ...props }: AlignCenterIconProps) {
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
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
      <rect x="8" y="8" width="8" height="8" rx="2" />
    </svg>
  );
}
