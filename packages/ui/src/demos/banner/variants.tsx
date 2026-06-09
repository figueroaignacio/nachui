'use client';

import { Banner } from '../../components/banner';

const variants = [
  {
    variant: 'default' as const,
    title: 'New feature available',
    description: 'Check out the latest updates we just shipped.',
  },
  {
    variant: 'info' as const,
    title: 'Info',
    description: 'This is an informational banner.',
  },
  {
    variant: 'success' as const,
    title: 'Success',
    description: 'This is a success banner.',
  },
  {
    variant: 'warning' as const,
    title: 'Warning',
    description: 'This is a warning banner.',
  },
  {
    variant: 'danger' as const,
    title: 'Danger',
    description: 'This is a danger banner.',
  },
];

export function Variants() {
  return (
    <div className="flex w-full flex-col gap-3">
      {variants.map((item) => (
        <Banner key={item.variant} variant={item.variant}>
          <Banner.Content>
            <Banner.Title>{item.title}</Banner.Title>
            <Banner.Description>{item.description}</Banner.Description>
          </Banner.Content>
        </Banner>
      ))}
    </div>
  );
}
