'use client';

import { Collapsible } from '../../components/collapsible';

const items = [
  {
    title: 'What is React?',
    content:
      'React is a JavaScript library for building user interfaces. It lets you create reusable components that manage their own state.',
  },
  {
    title: 'What are React Hooks?',
    content:
      'Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, and useContext.',
  },
  {
    title: 'What is JSX?',
    content:
      'JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write UI components in a more declarative way.',
  },
] as const;

export function Bordered() {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Collapsible key={item.title} variant="bordered" defaultOpen={index === 0}>
          <Collapsible.Trigger>
            <span className="text-lg font-semibold">{item.title}</span>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div className="space-y-2 pt-3">
              <p className="text-muted-foreground text-sm">{item.content}</p>
            </div>
          </Collapsible.Content>
        </Collapsible>
      ))}
    </div>
  );
}
