import * as React from 'react';

export type PaletteIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function PaletteIcon({ size = 24, strokeWidth = 1.5, ...props }: PaletteIconProps) {
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
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1.1.9-2 2-2h2a5 5 0 0 0 5-5c0-3.9-4.5-6.5-10-6.5Z" />
      <path d="M7.5 11h.01" />
      <path d="M10.5 7.5h.01" />
      <path d="M15 7.5h.01" />
    </svg>
  );
}
