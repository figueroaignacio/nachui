import * as React from 'react';

export type MoreVerticalIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function MoreVerticalIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: MoreVerticalIconProps) {
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
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
