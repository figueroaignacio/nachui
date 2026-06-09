'use client';

import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { Button } from '../../components/button';
import { DropdownMenu } from '../../components/dropdown-menu';

const ITEMS = [
  { id: 'status-bar', label: 'Status Bar' },
  { id: 'activity-bar', label: 'Activity Bar' },
  { id: 'panel', label: 'Panel' },
] as const;

const INITIAL_STATE: Record<string, boolean> = {
  'status-bar': true,
  'activity-bar': false,
  panel: false,
};

export function Checkboxes() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>(INITIAL_STATE);

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">View Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56" align="start">
        <DropdownMenu.Label>Appearance</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {ITEMS.map(({ id, label }) => (
          <DropdownMenu.Item key={id} onClick={() => toggle(id)}>
            <span className="flex w-6 items-center justify-center">
              {checked[id] && <HugeiconsIcon icon={Tick02Icon} size={16} />}
            </span>
            {label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
