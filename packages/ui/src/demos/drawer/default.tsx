'use client';

import { Button } from '../../components/button';
import { Drawer } from '../../components/drawer';

const notifications = [
  { from: 'Jane', message: 'Your report is ready for download.' },
  { from: 'System Alert', message: 'Scheduled maintenance at 3:00 AM UTC.' },
  { from: 'John', message: 'Please review the updated project plan.' },
] as const;

export function Default() {
  return (
    <Drawer>
      <Drawer.Trigger variant="outline">Open Drawer</Drawer.Trigger>
      <Drawer.Content side="right">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-muted-foreground text-sm">
            You have 3 new messages and 1 system alert. Review them below.
          </p>

          <div className="space-y-2 text-sm">
            {notifications.map((n) => (
              <div key={n.from} className="bg-accent/10 rounded-md border p-3">
                <strong>
                  {n.from === 'System Alert' ? 'System Alert:' : `Message from ${n.from}:`}
                </strong>{' '}
                {n.message}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Drawer.Close>Dismiss All</Drawer.Close>
            <Button>View Details</Button>
          </div>
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
