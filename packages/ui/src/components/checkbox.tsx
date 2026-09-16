'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function CheckIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

function MinusIcon({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
      <path d="M5 12h14" />
    </svg>
  );
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

function Checkbox({
  className,
  onCheckedChange,
  onChange,
  indeterminate = false,
  ref,
  ...props
}: CheckboxProps & { ref?: React.Ref<HTMLInputElement> }) {
  const innerRef = React.useRef<HTMLInputElement>(null);

  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [ref],
  );

  React.useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={cn('relative flex shrink-0 items-center justify-center', className)}>
      <input
        type="checkbox"
        ref={mergedRef}
        className="peer focus-visible:ring-ring border-primary checked:bg-primary checked:text-primary-foreground text-primary-foreground bg-background indeterminate:bg-primary size-4 shrink-0 cursor-pointer appearance-none rounded-sm border transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        {...props}
      />
      {indeterminate ? (
        <MinusIcon
          aria-hidden="true"
          className="text-primary-foreground pointer-events-none absolute size-3"
          size={12}
        />
      ) : (
        <CheckIcon
          aria-hidden="true"
          className="text-primary-foreground pointer-events-none absolute size-3 opacity-0 transition-opacity peer-checked:opacity-100"
          size={12}
        />
      )}
    </div>
  );
}
Checkbox.displayName = 'Checkbox';

export { Checkbox };
