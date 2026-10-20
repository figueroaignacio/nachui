import * as React from 'react';
import { cn } from '../lib/cn';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  ref?: React.Ref<HTMLLabelElement>;
  required?: boolean;
  optional?: boolean;
  description?: string;
  descriptionId?: string;
};

function Label({
  className,
  required,
  optional,
  description,
  descriptionId,
  children,
  ref,
  ...props
}: LabelProps) {
  const label = (
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-40 peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-destructive-text text-sm">
          *
        </span>
      )}
      {optional && <span className="text-muted-foreground text-xs font-normal">(optional)</span>}
    </label>
  );

  if (!description) return label;

  const hintId =
    descriptionId ?? (props.htmlFor ? `${props.htmlFor}-label-description` : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label}
      <span id={hintId} data-slot="label-description" className="text-muted-foreground text-xs">
        {description}
      </span>
    </div>
  );
}

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
