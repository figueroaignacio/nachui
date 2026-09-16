import * as React from 'react';

export type TextCursorInputIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function TextCursorInputIcon({
  size = 24,
  strokeWidth = 1.5,
  ...props
}: TextCursorInputIconProps) {
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
      <path d="M5 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1" />
      <path d="M19 6h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1" />
      <path d="M9 4h3" />
      <path d="M9 20h3" />
      <path d="M10.5 4v16" />
    </svg>
  );
}
