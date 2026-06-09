'use client';

import { Accordion } from '../../components/accordion';

const accordionItems = [
  {
    value: 'item-1',
    title: 'Life Hacks for Coders',
    content: (
      <>
        <p>
          Want to survive 12-hour coding sessions? Always keep snacks nearby and caffeine on
          standby. Bonus points for comfy socks and a chair that doesn't destroy your back.
        </p>
        <p>
          Remember: comments are your friend. Future you will thank past you for writing clear
          notes.
        </p>
      </>
    ),
  },
  {
    value: 'item-2',
    title: 'Debugging Secrets',
    content: (
      <>
        <p>
          Debugging is basically detective work, but your suspects are lines of code. Breakpoints
          are your magnifying glass.
        </p>
        <p>
          Pro tip: if it compiles but doesn't work, stare at the screen, whisper "why won't you
          work?," then Google like your life depends on it.
        </p>
      </>
    ),
  },
  {
    value: 'item-3',
    title: 'Random Productivity Tips',
    content: (
      <>
        <p>
          Sometimes the best way to get code done is to step away. Take a walk, pet your cat, or
          pretend to meditate.
        </p>
        <p>And remember: Ctrl+S is life. Save often, panic never.</p>
      </>
    ),
  },
];

export function Default() {
  return (
    <Accordion type="single" className="w-full" defaultValue="item-1">
      {accordionItems.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger value={item.value}>{item.title}</Accordion.Trigger>
          <Accordion.Content value={item.value} className="flex flex-col gap-4 text-balance">
            {item.content}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
