'use client';

import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

const notifications = [
  {
    tone: 'bg-success-text',
    title: 'Deploy completed',
    detail: 'Production build finished in 42s.',
    time: '2m ago',
  },
  {
    tone: 'bg-info-text',
    title: 'New comment',
    detail: 'Marcos replied to your review on checkout-flow.',
    time: '1h ago',
  },
  {
    tone: 'bg-warning-text',
    title: 'Storage almost full',
    detail: 'You have used 92% of your workspace quota.',
    time: '3h ago',
  },
];

export function Default() {
  return (
    <Stack gap="5" className="border-border bg-card w-full max-w-md rounded-xl border p-5">
      {notifications.map((notification) => (
        <Flex key={notification.title} gap="3" align="start">
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.tone}`}
            aria-hidden="true"
          />
          <Stack gap="1" className="min-w-0 flex-1">
            <Flex align="baseline" justify="between" gap="3">
              <p className="text-sm font-medium">{notification.title}</p>
              <span className="text-muted-foreground shrink-0 text-xs">{notification.time}</span>
            </Flex>
            <p className="text-muted-foreground text-xs">{notification.detail}</p>
          </Stack>
        </Flex>
      ))}
    </Stack>
  );
}
