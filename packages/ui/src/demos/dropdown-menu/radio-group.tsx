'use client';

import * as React from 'react';
import { Button } from '../../components/button';
import { DropdownMenu } from '../../components/dropdown-menu';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Amount, high to low' },
  { value: 'amount-asc', label: 'Amount, low to high' },
] as const;

export function RadioGroup() {
  const [sort, setSort] = React.useState<string>('newest');
  const active = SORT_OPTIONS.find((option) => option.value === sort);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Sort: {active?.label}</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56" align="start">
        <DropdownMenu.Label>Sort 240 orders by</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {SORT_OPTIONS.map((option) => (
          <DropdownMenu.Item key={option.value} onClick={() => setSort(option.value)}>
            <span className="flex w-6 items-center justify-center">
              {sort === option.value && <div className="bg-foreground size-2 rounded-full" />}
            </span>
            {option.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
