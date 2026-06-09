'use client';

import { Accordion } from '../../components/accordion';

const items = [
  {
    value: 'item-1',
    trigger: 'Will it start closed?',
    content:
      "Yes! When you don't provide a defaultValue prop, all items start in a collapsed state.",
  },
  {
    value: 'item-2',
    trigger: 'Can users still open items?',
    content:
      'Of course! Users can click any trigger to expand the content. It just starts fully collapsed.',
  },
  {
    value: 'item-3',
    trigger: 'When is this useful?',
    content:
      'This is great when you want users to actively choose what information they want to see, keeping the interface clean initially.',
  },
];

export function Collapsed() {
  return (
    <Accordion type="single" className="w-full">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger value={item.value}>{item.trigger}</Accordion.Trigger>
          <Accordion.Content value={item.value}>{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
