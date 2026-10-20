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
      <DropdownMenu.Content className="w-56 max-w-[calc(100vw-2rem)]" align="start">
        <DropdownMenu.Label>Sort 240 orders by</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {SORT_OPTIONS.map((option) => (
          <DropdownMenu.RadioItem
            key={option.value}
            checked={sort === option.value}
            onCheckedChange={() => setSort(option.value)}
          >
            {option.label}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
