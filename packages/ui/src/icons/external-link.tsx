import * as React from 'react';

export type ExternalLinkIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function ExternalLinkIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: ExternalLinkIconProps) {
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
      <path d="M14 3.5h6.5V10" />
      <path d="M20.5 3.5 11 13" />
      <path d="M18.5 13.5v3.5a3.5 3.5 0 0 1-3.5 3.5H7a3.5 3.5 0 0 1-3.5-3.5V9A3.5 3.5 0 0 1 7 5.5h3.5" />
    </svg>
  );
}
