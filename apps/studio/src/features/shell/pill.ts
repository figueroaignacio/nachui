import { buttonVariants } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';

type Options = Parameters<typeof buttonVariants>[0];

/** Button styles for links, in the Studio's pill shape. */
export function pill(options?: Options, className?: string): string {
  return cn(buttonVariants(options), 'rounded-full', className);
}
