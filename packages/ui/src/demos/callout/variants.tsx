import { Callout } from '../../components/callout';

const variants = [
  {
    variant: 'default' as const,
    title: 'Note',
    content: 'The CLI reads NACHUI_TOKEN from your shell first, then falls back to .env.local.',
  },
  {
    variant: 'info' as const,
    title: 'Good to know',
    content: 'Preview deploys are kept for 30 days and then removed automatically.',
  },
  {
    variant: 'success' as const,
    title: 'Recommended',
    content: 'Since v2.3 the compiler memoizes render output, so manual useMemo calls can go.',
  },
  {
    variant: 'warning' as const,
    title: 'Breaking change in v3.0',
    content: 'Button no longer forwards asChild. Wrap the child in Slot before you upgrade.',
  },
  {
    variant: 'danger' as const,
    title: 'This cannot be undone',
    content: 'Deleting a project removes its deploys, environment variables, and request logs.',
  },
];

export function Variants() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      {variants.map((item) => (
        <Callout key={item.variant} variant={item.variant}>
          <Callout.Title>{item.title}</Callout.Title>
          <Callout.Content>{item.content}</Callout.Content>
        </Callout>
      ))}
    </div>
  );
}
