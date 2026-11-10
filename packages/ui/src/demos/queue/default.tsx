'use client';

import { useState } from 'react';
import { Queue } from '../../ai/queue';
import { XIcon } from '../../icons/x';

const INITIAL = [
  { id: 'changelog', title: 'Update the changelog' },
  { id: 'pr', title: 'Open the pull request', description: 'Once the checkout suite passes' },
  { id: 'notify', title: 'Tell the team in #payments' },
];

export function Default() {
  const [queued, setQueued] = useState(INITIAL);

  return (
    <Queue className="max-w-md">
      <Queue.Section>
        <Queue.SectionTrigger count={queued.length}>Queued</Queue.SectionTrigger>
        <Queue.List>
          {queued.map((item) => (
            <Queue.Item
              key={item.id}
              description={item.description}
              actions={
                <Queue.ItemAction
                  label={`Remove ${item.title}`}
                  onClick={() =>
                    setQueued((items) => items.filter((entry) => entry.id !== item.id))
                  }
                >
                  <XIcon />
                </Queue.ItemAction>
              }
            >
              {item.title}
            </Queue.Item>
          ))}
        </Queue.List>
      </Queue.Section>
      <Queue.Section defaultOpen={false}>
        <Queue.SectionTrigger count={2}>Done</Queue.SectionTrigger>
        <Queue.List>
          <Queue.Item done>Reproduce the failure</Queue.Item>
          <Queue.Item done>Round once, after tax</Queue.Item>
        </Queue.List>
      </Queue.Section>
    </Queue>
  );
}
