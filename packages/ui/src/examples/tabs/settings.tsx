'use client';

import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Switch } from '../../components/switch';
import { Tabs } from '../../components/tabs';

export function Settings() {
  return (
    <Tabs defaultValue="general" size="sm" className="w-full max-w-md">
      <Tabs.List>
        <Tabs.Trigger value="general">General</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        <Tabs.Trigger value="danger">Danger zone</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="general">
        <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4">
          <Input id="workspace-name" label="Workspace name" defaultValue="Northwind Labs" />
          <Input
            id="workspace-slug"
            label="URL"
            defaultValue="northwind"
            description="app.nachui.tech/northwind"
          />
          <div className="flex justify-end">
            <Button size="sm">Save changes</Button>
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content value="notifications">
        <div className="border-border bg-card divide-border divide-y rounded-xl border">
          <div className="flex items-center justify-between gap-4 p-4">
            <span className="text-sm">Deploy finished</span>
            <Switch aria-label="Deploy finished" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <span className="text-sm">Weekly digest</span>
            <Switch aria-label="Weekly digest" />
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content value="danger">
        <div className="border-destructive-border bg-destructive-surface flex items-center justify-between gap-4 rounded-xl border p-4">
          <div>
            <p className="text-destructive-text text-sm font-medium">Delete workspace</p>
            <p className="text-muted-foreground text-xs">This cannot be undone.</p>
          </div>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      </Tabs.Content>
    </Tabs>
  );
}
