'use client';

import type { ReactNode } from 'react';

import { Collapsible } from '../../components/collapsible';

const items: { title: string; content: ReactNode }[] = [
  {
    title: '🚀 Getting Started',
    content: (
      <div className="space-y-2 pt-3">
        <p className="text-muted-foreground text-sm">
          Welcome to our platform! Here's everything you need to know to get started with your first
          project.
        </p>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
          <li>Create your account</li>
          <li>Set up your workspace</li>
          <li>Invite team members</li>
          <li>Start building!</li>
        </ul>
      </div>
    ),
  },
  {
    title: '📚 Documentation',
    content: (
      <div className="space-y-2 pt-3">
        <p className="text-muted-foreground text-sm">
          Explore our comprehensive documentation to learn about all features and capabilities.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <code className="bg-secondary rounded px-2 py-1 text-xs">API Reference</code>
          <code className="bg-secondary rounded px-2 py-1 text-xs">Guides</code>
          <code className="bg-secondary rounded px-2 py-1 text-xs">Examples</code>
        </div>
      </div>
    ),
  },
  {
    title: '⚙️ Settings',
    content: (
      <div className="space-y-2 pt-3">
        <p className="text-muted-foreground text-sm">
          Customize your experience with our flexible settings and preferences.
        </p>
      </div>
    ),
  },
];

export function Card() {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Collapsible key={item.title} variant="card" defaultOpen={index === 0}>
          <Collapsible.Trigger>
            <span className="text-lg font-semibold">{item.title}</span>
          </Collapsible.Trigger>
          <Collapsible.Content>{item.content}</Collapsible.Content>
        </Collapsible>
      ))}
    </div>
  );
}
