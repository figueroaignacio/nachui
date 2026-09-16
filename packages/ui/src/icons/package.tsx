import * as React from 'react';

export type PackageIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function PackageIcon({ size = 24, strokeWidth = 1.5, ...props }: PackageIconProps) {
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
      <path d="M20.5 7.8 12 3.5 3.5 7.8v8.4L12 20.5l8.5-4.3V7.8Z" />
      <path d="M3.5 7.8 12 12l8.5-4.2" />
      <path d="M12 12v8.5" />
      <path d="m7.8 5.7 8.5 4.2" />
    </svg>
  );
}
