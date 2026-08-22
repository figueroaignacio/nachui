'use client';

import { Badge } from '../../components/badge';
import { Card } from '../../components/card';
import { Tabs } from '../../components/tabs';

const profile = [
  { label: 'Full name', value: 'Lucia Mendez' },
  { label: 'Email', value: 'lucia@acmestudio.dev' },
  { label: 'Role', value: 'Workspace owner' },
  { label: 'Member since', value: 'Aug 2023' },
];

const sessions = [
  { device: 'MacBook Pro, Chrome', location: 'Lisbon, PT', seen: 'Active now' },
  { device: 'iPhone 15, Safari', location: 'Lisbon, PT', seen: '2h ago' },
  { device: 'Windows, Firefox', location: 'Berlin, DE', seen: 'Mar 09' },
];

const alerts = [
  { title: 'Deploy failures', detail: 'Email and Slack', enabled: true },
  { title: 'Weekly usage report', detail: 'Email, Mondays at 9:00', enabled: true },
  { title: 'Comment mentions', detail: 'Slack only', enabled: false },
];

export function Vertical() {
  return (
    <Tabs defaultValue="account" className="flex w-full flex-col gap-4 sm:flex-row">
      <Tabs.List className="flex h-auto w-full flex-col justify-start sm:w-44">
        <Tabs.Trigger value="account" className="w-full justify-start">
          Account
        </Tabs.Trigger>
        <Tabs.Trigger value="security" className="w-full justify-start">
          Security
        </Tabs.Trigger>
        <Tabs.Trigger value="notifications" className="w-full justify-start">
          Notifications
        </Tabs.Trigger>
      </Tabs.List>

      <div className="min-w-0 flex-1">
        <Tabs.Content value="account" className="mt-0">
          <Card>
            <Card.Header>
              <Card.Title>Account</Card.Title>
              <Card.Description>The details your teammates see.</Card.Description>
            </Card.Header>
            <Card.Content>
              <dl className="divide-border divide-y text-sm">
                {profile.map((field) => (
                  <div key={field.label} className="flex justify-between gap-3 py-2">
                    <dt className="text-muted-foreground">{field.label}</dt>
                    <dd className="font-medium">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </Card.Content>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="security" className="mt-0">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                Security
                <Badge variant="success">2FA on</Badge>
              </Card.Title>
              <Card.Description>Password last changed on Feb 02.</Card.Description>
            </Card.Header>
            <Card.Content>
              <ul className="divide-border divide-y text-sm">
                {sessions.map((session) => (
                  <li key={session.device} className="flex justify-between gap-3 py-2">
                    <span>
                      <span className="block font-medium">{session.device}</span>
                      <span className="text-muted-foreground text-xs">{session.location}</span>
                    </span>
                    <span className="text-muted-foreground text-xs">{session.seen}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="notifications" className="mt-0">
          <Card>
            <Card.Header>
              <Card.Title>Notifications</Card.Title>
              <Card.Description>What we send you, and where.</Card.Description>
            </Card.Header>
            <Card.Content>
              <ul className="divide-border divide-y text-sm">
                {alerts.map((alert) => (
                  <li key={alert.title} className="flex justify-between gap-3 py-2">
                    <span>
                      <span className="block font-medium">{alert.title}</span>
                      <span className="text-muted-foreground text-xs">{alert.detail}</span>
                    </span>
                    <Badge variant={alert.enabled ? 'success' : 'secondary'}>
                      {alert.enabled ? 'On' : 'Off'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </Tabs.Content>
      </div>
    </Tabs>
  );
}
