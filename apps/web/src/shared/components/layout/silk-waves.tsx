import { cn } from '@repo/ui/lib/cn';

export function SilkWaves({ className }: { className?: string }) {
  return (
    <div className={cn('hero-waves', className)} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
