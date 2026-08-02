import * as React from 'react';
import { cn } from '../lib/cn';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  ref?: React.Ref<HTMLLabelElement>;
  required?: boolean;
  optional?: boolean;
  description?: string;
};

function Label({
  className,
  required,
  optional,
  description,
  children,
  ref,
  ...props
}: LabelProps) {
  const label = (
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <>
          <span aria-hidden="true" className="text-destructive text-sm">
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      )}
      {optional && <span className="text-muted-foreground text-xs font-normal">(optional)</span>}
    </label>
  );

  // Only wrap when a description is present, so the label keeps working as a
  // direct sibling of its control (peer-* styles, inline layouts).
  if (!description) return label;

  return (
    <div className="flex flex-col gap-1">
      {label}
      <span className="text-muted-foreground text-xs">{description}</span>
    </div>
  );
}

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
