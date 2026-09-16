import * as React from 'react';

export type SettingsIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SettingsIcon({ size = 24, strokeWidth = 1.5, ...props }: SettingsIconProps) {
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
      <path d="M10.4 3.2c.4-1.6 2.8-1.6 3.2 0l.2.9a1.7 1.7 0 0 0 2.5 1l.8-.5c1.4-.8 3.1.9 2.3 2.3l-.5.8a1.7 1.7 0 0 0 1 2.5l.9.2c1.6.4 1.6 2.8 0 3.2l-.9.2a1.7 1.7 0 0 0-1 2.5l.5.8c.8 1.4-.9 3.1-2.3 2.3l-.8-.5a1.7 1.7 0 0 0-2.5 1l-.2.9c-.4 1.6-2.8 1.6-3.2 0l-.2-.9a1.7 1.7 0 0 0-2.5-1l-.8.5c-1.4.8-3.1-.9-2.3-2.3l.5-.8a1.7 1.7 0 0 0-1-2.5l-.9-.2c-1.6-.4-1.6-2.8 0-3.2l.9-.2a1.7 1.7 0 0 0 1-2.5l-.5-.8c-.8-1.4.9-3.1 2.3-2.3l.8.5a1.7 1.7 0 0 0 2.5-1l.2-.9Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
