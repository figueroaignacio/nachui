import { cn } from '@repo/ui/lib/cn';

type PageFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Full-width page frame: keeps the fluid layout but draws a hairline rail down
 * each side of the content. Horizontal separators inside it should use the
 * `rule-bleed` utility so they cross the rails out to the viewport edges.
 */
export function PageFrame({ children, className }: PageFrameProps) {
  return (
    <div className="page-frame-outer">
      <div className={cn('page-frame relative', className)}>{children}</div>
    </div>
  );
}
