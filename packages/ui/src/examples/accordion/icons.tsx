'use client';

import {
  CreditCardIcon,
  Key01Icon,
  Notification03Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Accordion } from '../../components/accordion';
import { Badge } from '../../components/badge';

const sections = [
  {
    value: 'members',
    icon: UserGroupIcon,
    title: 'Members',
    badge: '12',
    body: 'Invite teammates, assign roles and remove access. Owners can transfer the workspace.',
  },
  {
    value: 'billing',
    icon: CreditCardIcon,
    title: 'Billing',
    badge: 'Pro',
    body: 'Update the payment method, download invoices and change the plan at any time.',
  },
  {
    value: 'api-keys',
    icon: Key01Icon,
    title: 'API keys',
    badge: '3',
    body: 'Create scoped keys for CI and local development. Keys can be rotated without downtime.',
  },
  {
    value: 'notifications',
    icon: Notification03Icon,
    title: 'Notifications',
    badge: null,
    body: 'Choose which events reach your inbox: deploys, failed jobs, mentions and weekly digests.',
  },
];

export function Icons() {
  return (
    <Accordion type="single" className="w-full max-w-md" defaultValue="members">
      {sections.map((section) => (
        <Accordion.Item key={section.value} value={section.value}>
          <Accordion.Trigger value={section.value}>
            <span className="flex items-center gap-2.5">
              <HugeiconsIcon
                icon={section.icon}
                size={16}
                className="text-muted-foreground shrink-0"
              />
              {section.title}
              {section.badge && <Badge variant="secondary">{section.badge}</Badge>}
            </span>
          </Accordion.Trigger>
          <Accordion.Content value={section.value} className="text-muted-foreground text-sm">
            {section.body}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
