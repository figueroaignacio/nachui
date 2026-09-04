'use client';

import { Button } from '../../components/button';
import { Drawer } from '../../components/drawer';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { Select } from '../../components/select';

export function Form() {
  return (
    <Drawer>
      <Drawer.Trigger variant="outline">New API key</Drawer.Trigger>
      <Drawer.Content side="bottom">
        <Drawer.Header>
          <Drawer.Title>Create an API key</Drawer.Title>
          <Drawer.Description>
            The secret is shown once, right after you create it. Store it in your CI provider before
            you close this panel.
          </Drawer.Description>
        </Drawer.Header>

        <div className="mx-auto grid w-full max-w-md gap-4 py-2">
          <Input
            id="key-name"
            label="Key name"
            defaultValue="ci-deploy-prod"
            description="Shown in the audit log next to every request."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="key-scope">Scope</Label>
              <Select defaultValue="deploy">
                <Select.Trigger id="key-scope" />
                <Select.Content>
                  <Select.Item value="read">Read only</Select.Item>
                  <Select.Item value="deploy">Deploy and read logs</Select.Item>
                  <Select.Item value="admin">Full workspace access</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="key-expiry">Expires</Label>
              <Select defaultValue="90">
                <Select.Trigger id="key-expiry" />
                <Select.Content>
                  <Select.Item value="30">In 30 days</Select.Item>
                  <Select.Item value="90">In 90 days</Select.Item>
                  <Select.Item value="never">Never</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md items-center justify-end gap-2">
          <Drawer.Close className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Cancel
          </Drawer.Close>
          <Button size="sm">Create key</Button>
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
