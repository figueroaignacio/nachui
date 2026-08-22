'use client';

import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Popover } from '../../components/popover';

export function Default() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="ghost">acme-web</Button>
      </Popover.Trigger>
      <Popover.Content className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="text-sm leading-none font-medium">Rename project</h4>
            <p className="text-muted-foreground text-xs">
              The old name keeps redirecting for 30 days.
            </p>
          </div>
          <Input
            id="project-slug"
            label="Project name"
            defaultValue="acme-web"
            description="Preview URL: acme-web.northwind.app"
          />
          <div className="flex justify-end gap-2">
            <Popover.Close asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Popover.Close>
            <Popover.Close asChild>
              <Button size="sm">Rename</Button>
            </Popover.Close>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}
