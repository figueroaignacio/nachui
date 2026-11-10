import { cn } from '@repo/ui/lib/cn';

export type Template = { title: string; prompt: string; kind: Thumb };
type Thumb = 'dashboard' | 'pricing' | 'settings' | 'auth';

export const TEMPLATES: Template[] = [
  {
    title: 'Analytics dashboard',
    kind: 'dashboard',
    prompt: 'An analytics dashboard with three stat cards, a weekly chart and a table of top pages',
  },
  {
    title: 'Pricing with three plans',
    kind: 'pricing',
    prompt: 'A pricing page with three plans, a monthly and yearly switch and a short FAQ',
  },
  {
    title: 'Account settings',
    kind: 'settings',
    prompt: 'Account settings with a side menu, a profile form and notification switches',
  },
  {
    title: 'Sign in with magic link',
    kind: 'auth',
    prompt: 'A sign in card with an email field, a magic link button and a GitHub option',
  },
];

const line = 'bg-input block rounded-sm';
const box = 'border-border block rounded-md border';

export function TemplateThumb({ kind }: { kind: Thumb }) {
  if (kind === 'dashboard') {
    return (
      <span className="flex size-full flex-col gap-2 p-3.5">
        <span className={cn(line, 'bg-foreground h-2 w-2/5')} />
        <span className="grid grid-cols-3 gap-1.5">
          <span className={cn(box, 'h-7')} />
          <span className={cn(box, 'h-7')} />
          <span className={cn(box, 'h-7')} />
        </span>
        <span className={cn(box, 'flex flex-1 items-end gap-1 p-2')}>
          {[40, 70, 55, 90, 65].map((height, index) => (
            <span
              key={height}
              className={cn('flex-1 rounded-xs', index === 3 ? 'bg-foreground' : 'bg-input')}
              style={{ height: `${height}%` }}
            />
          ))}
        </span>
      </span>
    );
  }
  if (kind === 'pricing') {
    return (
      <span className="grid size-full grid-cols-3 gap-2 p-3.5">
        {[false, true, false].map((featured, index) => (
          <span
            key={index}
            className={cn(
              'flex flex-col gap-1.5 rounded-md p-2',
              featured ? 'bg-foreground' : 'border-border border',
            )}
          >
            <span className={cn(line, 'h-1.5 w-1/2', featured && 'bg-muted-foreground')} />
            <span
              className={cn(line, 'h-2.5 w-3/4', featured ? 'bg-background' : 'bg-foreground')}
            />
            <span
              className={cn(
                'mt-auto block h-3 rounded-sm',
                featured ? 'bg-background' : 'border-input border',
              )}
            />
          </span>
        ))}
      </span>
    );
  }
  if (kind === 'settings') {
    return (
      <span className="flex size-full">
        <span className="border-border flex w-1/3 flex-col gap-1.5 border-e p-2.5">
          <span className={cn(line, 'bg-foreground h-1.5 w-3/4')} />
          <span className={cn(line, 'h-1.5 w-1/2')} />
          <span className={cn(line, 'h-1.5 w-2/3')} />
        </span>
        <span className="flex flex-1 flex-col gap-2 p-3">
          <span className={cn(line, 'bg-foreground h-2 w-2/5')} />
          <span className={cn(box, 'h-4')} />
          <span className={cn(box, 'h-4')} />
          <span className="flex items-center justify-between">
            <span className={cn(line, 'h-1.5 w-2/5')} />
            <span className="bg-foreground block h-3 w-5 rounded-full" />
          </span>
        </span>
      </span>
    );
  }
  return (
    <span className="grid size-full place-items-center">
      <span className="border-border bg-card flex w-1/2 flex-col gap-1.5 rounded-lg border p-3">
        <span className={cn(line, 'bg-foreground mx-auto mb-1 h-2 w-1/2')} />
        <span className={cn(box, 'h-3.5')} />
        <span className="bg-foreground block h-3.5 rounded-md" />
        <span className={cn(box, 'h-3.5')} />
      </span>
    </span>
  );
}
