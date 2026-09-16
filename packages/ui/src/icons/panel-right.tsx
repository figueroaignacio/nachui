import * as React from 'react';

export type PanelRightIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function PanelRightIcon({ size = 24, strokeWidth = 1.5, ...props }: PanelRightIconProps) {
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
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" />
      <path d="M14.5 3.5v17" />
    </svg>
  );
}
