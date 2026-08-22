'use client';

import { Drawer } from '../../components/drawer';

const panels = [
  {
    side: 'top',
    trigger: 'Release notes',
    title: 'What changed in v2.14',
    description: 'Shipped to production on Mar 14.',
    items: [
      'Deploy logs now stream while the build runs',
      'Region picker moved into project settings',
      'Fixed stale cache on custom domains',
    ],
    action: 'Got it',
  },
  {
    side: 'right',
    trigger: 'Filters',
    title: 'Filter deploys',
    description: '1,204 deploys in this project.',
    items: ['Production only', 'Failed builds', 'Last 7 days'],
    action: 'Apply filters',
  },
  {
    side: 'bottom',
    trigger: 'Quick actions',
    title: 'Run a task',
    description: 'Nothing here leaves the dashboard.',
    items: ['Redeploy the latest commit', 'Roll back to v2.13.4', 'Clear the build cache'],
    action: 'Close',
  },
  {
    side: 'left',
    trigger: 'Workspace',
    title: 'Northwind',
    description: 'Pro plan, 12 of 20 seats used.',
    items: ['Projects', 'Deployments', 'Usage and billing'],
    action: 'Close',
  },
] as const;

export function Positions() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-4">
      {panels.map((panel) => (
        <Drawer key={panel.side}>
          <Drawer.Trigger variant="outline" className="w-full justify-between gap-2">
            {panel.trigger}
            <span className="text-muted-foreground text-xs">{panel.side}</span>
          </Drawer.Trigger>
          <Drawer.Content side={panel.side}>
            <Drawer.Header>
              <Drawer.Title>{panel.title}</Drawer.Title>
              <Drawer.Description>{panel.description}</Drawer.Description>
            </Drawer.Header>
            <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
              {panel.items.map((item) => (
                <li key={item} className="border-border bg-card rounded-md border px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <Drawer.Close className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                {panel.action}
              </Drawer.Close>
            </div>
          </Drawer.Content>
        </Drawer>
      ))}
    </div>
  );
}
