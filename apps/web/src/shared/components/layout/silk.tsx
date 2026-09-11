import { cn } from '@repo/ui/lib/cn';

export function Silk({ className }: { className?: string }) {
  return <div className={cn('silk-sheet', className)} aria-hidden="true" />;
}
