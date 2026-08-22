'use client';

import { Collapsible } from '../../components/collapsible';

const usage = [
  {
    title: 'Bandwidth',
    total: '412 GB of 1 TB',
    lines: [
      { label: 'Edge cache hits', value: '286 GB' },
      { label: 'Origin responses', value: '104 GB' },
      { label: 'Image optimization', value: '22 GB' },
    ],
  },
  {
    title: 'Build minutes',
    total: '318 of 400',
    lines: [
      { label: 'Production builds', value: '96 min' },
      { label: 'Preview builds', value: '204 min' },
      { label: 'Cancelled builds', value: '18 min' },
    ],
  },
  {
    title: 'Edge requests',
    total: '2.4M of 5M',
    lines: [
      { label: 'API routes', value: '1.7M' },
      { label: 'Static assets', value: '0.6M' },
      { label: 'Redirects', value: '0.1M' },
    ],
  },
];

export function Bordered() {
  return (
    <div className="w-full max-w-md space-y-3">
      {usage.map((group, index) => (
        <Collapsible key={group.title} variant="bordered" defaultOpen={index === 0}>
          <Collapsible.Trigger>
            <span className="flex flex-col items-start">
              <span className="text-sm font-medium">{group.title}</span>
              <span className="text-muted-foreground text-xs">{group.total}</span>
            </span>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <dl className="divide-border divide-y pt-1">
              {group.lines.map((line) => (
                <div key={line.label} className="flex items-center justify-between gap-3 py-2">
                  <dt className="text-muted-foreground text-xs">{line.label}</dt>
                  <dd className="text-xs font-medium tabular-nums">{line.value}</dd>
                </div>
              ))}
            </dl>
          </Collapsible.Content>
        </Collapsible>
      ))}
    </div>
  );
}
