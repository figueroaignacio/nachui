'use client';

import { buttonVariants } from '@repo/ui/components/button';
import type { VariantProps } from 'class-variance-authority';
import { pill } from './pill';

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

/** An anchor styled as a NachUI button, usable from server components. */
export function LinkButton({ className, variant, size, children, ...props }: LinkButtonProps) {
  return (
    <a className={pill({ variant, size }, className)} {...props}>
      {children}
    </a>
  );
}
