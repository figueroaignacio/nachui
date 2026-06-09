'use client';

import { Typography } from '../../components/typography';

const items = [
  {
    label: 'Lead Text',
    variant: 'lead' as const,
    content: 'A tall paragraph text style designed to introduce an article or section.',
  },
  {
    label: 'Large Text',
    variant: 'large' as const,
    content: 'Slightly larger copy designed for subheaders, callouts, or featured content.',
  },
  {
    label: 'Small & Muted Text',
    variant: 'muted' as const,
    content: 'De-emphasized descriptive text, perfect for captions or legal copy.',
  },
];

export function LeadMuted() {
  return (
    <div className="flex w-full flex-col gap-4">
      {items.map(({ label, variant, content }) => (
        <div key={variant}>
          <Typography
            variant="small"
            className="text-primary mb-1 block font-bold tracking-wider uppercase"
          >
            {label}
          </Typography>
          <Typography variant={variant}>{content}</Typography>
        </div>
      ))}
    </div>
  );
}
