'use client';

import { Card } from '../../components/card';
import { Tabs } from '../../components/tabs';

const tabs = [
  {
    value: 'account',
    label: 'Account',
    title: 'Account Settings',
    description: 'Manage your account settings here.',
    content: 'This is the account settings tab content.',
  },
  {
    value: 'password',
    label: 'Password',
    title: 'Password',
    description: 'Change your password here.',
    content: 'This is the password tab content.',
  },
  {
    value: 'notifications',
    label: 'Notifications',
    title: 'Notifications',
    description: 'Manage your notification preferences.',
    content: 'This is the notifications tab content.',
  },
] as const;

export function Vertical() {
  return (
    <Tabs defaultValue="account" className="flex flex-col gap-4 sm:flex-row">
      <Tabs.List className="flex h-auto w-full flex-col justify-start sm:w-48">
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value} className="w-full justify-start">
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <div className="flex-1">
        {tabs.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value} className="mt-0">
            <Card>
              <Card.Header>
                <Card.Title>{tab.title}</Card.Title>
                <Card.Description>{tab.description}</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">{tab.content}</p>
                </div>
              </Card.Content>
            </Card>
          </Tabs.Content>
        ))}
      </div>
    </Tabs>
  );
}
