'use client';

import { useState } from 'react';
import { Queue } from '../../ai/queue';
import { XIcon } from '../../icons/x';
import { usePlayback } from '../../lib/use-playback';

const ITEMS = [
  { id: 'reproduce', title: 'Reproduce the failure' },
  { id: 'round', title: 'Round once, after tax' },
  { id: 'changelog', title: 'Update the changelog' },
  { id: 'pr', title: 'Open the pull request', description: 'Once the checkout suite passes' },
  { id: 'notify', title: 'Tell the team in #payments' },
];

const FINISHED = 2;

export function Default() {
  const [removed, setRemoved] = useState<string[]>([]);
  const { step, rootProps } = usePlayback(FINISHED, 1300);

  const done = ITEMS.slice(0, step);
  const queued = ITEMS.slice(step).filter((item) => !removed.includes(item.id));

  return (
    <div {...rootProps} className="w-full max-w-md">
      <Queue>
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
                    onClick={() => setRemoved((ids) => [...ids, item.id])}
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
        <Queue.Section>
          <Queue.SectionTrigger count={done.length}>Done</Queue.SectionTrigger>
          <Queue.List>
            {done.map((item) => (
              <Queue.Item key={item.id} done>
                {item.title}
              </Queue.Item>
            ))}
          </Queue.List>
        </Queue.Section>
      </Queue>
    </div>
  );
}
