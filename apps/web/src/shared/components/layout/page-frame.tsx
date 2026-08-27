import { cn } from '@repo/ui/lib/cn';

type PageFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Full-width page frame: sets the gutter and the padding that everything on the
 * page aligns to. It draws nothing itself. Horizontal separators inside it
 * should use the `rule-bleed` utility so they run out to the viewport edges,
 * which is where the layout's structure now comes from.
 */
export function PageFrame({ children, className }: PageFrameProps) {
  return (
    <div className="page-frame-outer">
      <div className={cn('page-frame relative', className)}>{children}</div>
    </div>
  );
}
