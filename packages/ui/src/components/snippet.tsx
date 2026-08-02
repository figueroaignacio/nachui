import React from 'react';
import { cn } from '../lib/cn';

export interface SnippetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Snippet({ children, className, ...props }: SnippetProps) {
  return (
    <div className={cn('flex min-h-25 items-center', className)} {...props}>
      <div className="bg-primary-foreground w-full rounded-xl px-6 py-3">{children}</div>
    </div>
  );
}
Snippet.displayName = 'Snippet';
