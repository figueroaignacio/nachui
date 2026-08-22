'use client';

import { Banner } from '../../components/banner';

const variants = [
  {
    variant: 'default' as const,
    title: 'Deploy previews are now free on every plan',
    description: 'Every pull request gets its own preview URL, with no extra build minutes.',
  },
  {
    variant: 'info' as const,
    title: 'Scheduled maintenance on Mar 14',
    description: 'The dashboard is read only from 02:00 to 04:00 UTC.',
  },
  {
    variant: 'success' as const,
    title: 'acmestudio.dev is verified',
    description: 'DNS records propagated and production traffic is live.',
  },
  {
    variant: 'warning' as const,
    title: 'Your API key expires in 5 days',
    description: 'The key ending in 8f21 stops working on Mar 28.',
  },
  {
    variant: 'danger' as const,
    title: 'We could not charge your card',
    description: 'Invoice INV-2043 was declined. Update your billing details before Mar 20.',
  },
];

export function Variants() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
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
