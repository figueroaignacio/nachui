import { cn } from '@repo/ui/lib/cn';

function ArrowDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 5c11 3 22 12 27 27"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M23.5 27.5l8.5 5 1.5-10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Handwritten margin note with a doodle arrow, in the spirit of annotated
 * SaaS hero screenshots. Position it via `className` inside a `relative`
 * parent; purely decorative, so wrap groups of these in `aria-hidden`.
 */
export function Annotation({
  label,
  arrow,
  className,
}: {
  label: string;
  arrow: 'down-right' | 'down-left' | 'up-right';
  className?: string;
}) {
  const arrowEl = (
    <ArrowDoodle
      className={cn(
        'h-5 w-5 shrink-0 lg:h-7 lg:w-7',
        arrow === 'down-left' && '-scale-x-100',
        arrow === 'up-right' && '-scale-y-100',
      )}
    />
  );

  return (
    <div className={cn('text-muted-foreground absolute flex items-start gap-1', className)}>
      {arrow === 'down-left' ? (
        <>
          <span className="mt-4">{arrowEl}</span>
          <span className="font-mono text-xs leading-tight italic lg:text-sm">{label}</span>
        </>
      ) : (
        <>
          <span className="font-mono text-xs leading-tight italic lg:text-sm">{label}</span>
          <span className={arrow === 'up-right' ? 'mb-4 self-end' : 'mt-4'}>{arrowEl}</span>
        </>
      )}
    </div>
  );
}
