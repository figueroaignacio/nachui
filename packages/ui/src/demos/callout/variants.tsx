import { Callout } from '../../components/callout';

const variants = [
  {
    variant: 'default' as const,
    title: 'Default Callout',
    content: 'This is a default callout without any specific variant.',
  },
  {
    variant: 'info' as const,
    title: 'Information',
    content: 'This is an info callout used for general information.',
  },
  {
    variant: 'success' as const,
    title: 'Success',
    content: 'This is a success callout. The operation was completed successfully.',
  },
  {
    variant: 'warning' as const,
    title: 'Warning',
    content: 'This is a warning callout. Be careful interacting with this.',
  },
  {
    variant: 'danger' as const,
    title: 'Error',
    content: 'This is a danger callout. Something went wrong.',
  },
];

export function Variants() {
  return (
    <div className="flex w-full flex-col gap-3">
      {variants.map((item) => (
        <Callout key={item.variant} variant={item.variant}>
          <Callout.Title>{item.title}</Callout.Title>
          <Callout.Content>{item.content}</Callout.Content>
        </Callout>
      ))}
    </div>
  );
}
