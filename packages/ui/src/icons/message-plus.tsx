import * as React from 'react';

export type MessagePlusIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function MessagePlusIcon({ size = 24, strokeWidth = 1.5, ...props }: MessagePlusIconProps) {
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
      <path d="M12 21c5 0 9.5-3.8 9.5-8.5S17 4 12 4 2.5 7.8 2.5 12.5c0 1.8.6 3.5 1.5 4.9L3 21l4.3-1.3c1.4.8 3 1.3 4.7 1.3Z" />
      <path d="M12 9.5v6" />
      <path d="M9 12.5h6" />
    </svg>
  );
}
