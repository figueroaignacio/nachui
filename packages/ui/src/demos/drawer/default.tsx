'use client';

import { Button } from '../../components/button';
import { Drawer } from '../../components/drawer';

const activity = [
  {
    tone: 'bg-destructive-text',
    title: 'Build failed on main',
    detail: 'api-gateway, step "typecheck" exited with code 2.',
    time: '4m ago',
  },
  {
    tone: 'bg-success-text',
    title: 'Deploy promoted to production',
    detail: 'web v2.14.0 is now serving all traffic.',
    time: '26m ago',
  },
  {
    tone: 'bg-info-text',
    title: 'Sofia Arriaga requested your review',
    detail: 'Pull request #482, rate limits on checkout.',
    time: '1h ago',
  },
  {
    tone: 'bg-warning-text',
    title: 'Postgres disk at 84%',
    detail: 'db-primary in us-east-1 needs more storage this week.',
    time: '3h ago',
  },
] as const;

export function Default() {
  return (
    <Drawer>
      <Drawer.Trigger variant="outline">Activity</Drawer.Trigger>
      <Drawer.Content side="right">
        <Drawer.Header>
          <Drawer.Title>Activity</Drawer.Title>
          <Drawer.Description>Everything that happened in Northwind today.</Drawer.Description>
        </Drawer.Header>

        <div className="flex flex-col gap-4">
          {activity.map((event) => (
            <div key={event.title} className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${event.tone}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">{event.title}</p>
                  <span className="text-muted-foreground shrink-0 text-xs">{event.time}</span>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Drawer.Close className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Mark all as read
          </Drawer.Close>
          <Button size="sm">Open deploy log</Button>
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
