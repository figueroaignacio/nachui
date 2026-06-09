'use client';

import { Accordion } from '../../components/accordion';

const items = [
  {
    value: 'item-1',
    trigger: 'Can I open multiple items?',
    content:
      'Yes! When using type="multiple", you can have multiple accordion items open at the same time.',
  },
  {
    value: 'item-2',
    trigger: 'How does it work?',
    content:
      'Simply set the type prop to "multiple" and users can expand as many sections as they want simultaneously.',
  },
  {
    value: 'item-3',
    trigger: 'Is this useful?',
    content:
      "Absolutely! It's perfect for FAQ sections where users might want to compare multiple answers at once.",
  },
];

export function Multiple() {
  return (
    <Accordion type="multiple" className="w-full">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger value={item.value}>{item.trigger}</Accordion.Trigger>
          <Accordion.Content value={item.value}>{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
