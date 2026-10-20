'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  inputClassName?: string;
}

function Radio({
  className,
  inputClassName,
  onCheckedChange,
  onChange,
  ref,
  ...props
}: RadioProps & { ref?: React.Ref<HTMLInputElement> }) {
  const innerRef = React.useRef<HTMLInputElement>(null);

  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [ref],
  );

  return (
    <div
      role="presentation"
      className={cn(
        "relative flex shrink-0 items-center justify-center before:absolute before:-inset-2 before:content-[''] pointer-coarse:before:-inset-3.5",
        className,
      )}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.currentTarget.closest('label')) return;
        innerRef.current?.click();
      }}
    >
      <input
        type="radio"
        ref={mergedRef}
        className={cn(
          'peer focus-visible:ring-ring border-primary checked:border-primary checked:bg-primary bg-background ring-offset-background relative size-4 shrink-0 cursor-pointer appearance-none rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 forced-colors:checked:border-[Highlight]',
          inputClassName,
        )}
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        {...props}
      />
      <div
        aria-hidden="true"
        data-slot="radio-indicator"
        className="bg-background pointer-events-none absolute size-1.5 rounded-full opacity-0 transition-opacity peer-checked:opacity-100 forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none"
      />
    </div>
  );
}
Radio.displayName = 'Radio';

export { Radio };
