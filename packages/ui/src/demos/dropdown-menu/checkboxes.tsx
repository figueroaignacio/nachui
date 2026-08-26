'use client';

import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { Button } from '../../components/button';
import { DropdownMenu } from '../../components/dropdown-menu';

const COLUMNS = [
  { id: 'customer', label: 'Customer' },
  { id: 'status', label: 'Status' },
  { id: 'amount', label: 'Amount' },
  { id: 'method', label: 'Payment method' },
  { id: 'created', label: 'Created' },
] as const;

const INITIAL_STATE: Record<string, boolean> = {
  customer: true,
  status: true,
  amount: true,
  method: false,
  created: false,
};

export function Checkboxes() {
  const [visible, setVisible] = React.useState<Record<string, boolean>>(INITIAL_STATE);

  const toggle = (id: string) => setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  const shownCount = COLUMNS.filter((column) => visible[column.id]).length;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          Columns ({shownCount}/{COLUMNS.length})
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56 max-w-[calc(100vw-2rem)]" align="start">
        <DropdownMenu.Label>Show in orders table</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {COLUMNS.map(({ id, label }) => (
          <DropdownMenu.Item key={id} onClick={() => toggle(id)}>
            <span className="flex w-6 items-center justify-center">
              {visible[id] && <HugeiconsIcon icon={Tick02Icon} size={16} />}
            </span>
            {label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
