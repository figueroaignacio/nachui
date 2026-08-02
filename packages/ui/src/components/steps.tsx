import * as React from 'react';
import { cn } from '../lib/cn';

export type StepsProps = React.HTMLAttributes<HTMLDivElement>;

export function Steps({ className, children, ...props }: StepsProps) {
  return (
    <div
      className={cn(
        'steps border-border mb-12 ml-4 border-l pl-6.5 [counter-reset:step]',
        // Targets nested headers (h4)
        '[&>h4]:step [&>h4]:before:bg-secondary-foreground [&>h4]:before:text-background [&>h4]:relative [&>h4]:mt-7! [&>h4]:mb-5 [&>h4]:[counter-increment:step] [&>h4]:before:absolute [&>h4]:before:-mt-0.5 [&>h4]:before:-ml-9.25 [&>h4]:before:flex [&>h4]:before:h-5 [&>h4]:before:w-5 [&>h4]:before:items-center [&>h4]:before:justify-center [&>h4]:before:rounded-full [&>h4]:before:text-center [&>h4]:before:text-[13px] [&>h4]:before:font-medium [&>h4]:before:content-[counter(step)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
