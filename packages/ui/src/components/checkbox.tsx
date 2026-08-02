'use client';

import { MinusSignIcon, Tick01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { cn } from '../lib/cn';

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
        <HugeiconsIcon
          icon={MinusSignIcon}
          aria-hidden="true"
          className="text-primary-foreground pointer-events-none absolute size-3"
          size={12}
        />
      ) : (
        <HugeiconsIcon
          icon={Tick01Icon}
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
