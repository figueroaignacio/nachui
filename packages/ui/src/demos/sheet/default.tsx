'use client';

import { Button } from '../../components/button';
import { Checkbox } from '../../components/checkbox';
import { Label } from '../../components/label';
import { Sheet } from '../../components/sheet';

const FILTERS = [
  { id: 'open', label: 'Open pull requests', checked: true },
  { id: 'mine', label: 'Assigned to me', checked: true },
  { id: 'draft', label: 'Include drafts', checked: false },
  { id: 'ci', label: 'Failing checks only', checked: false },
];

export function Default() {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button variant="outline">Filters</Button>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Filters</Sheet.Title>
          <Sheet.Description>Narrow the list without leaving the page.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body className="flex flex-col gap-4">
          {FILTERS.map((filter) => (
            <div key={filter.id} className="flex items-center gap-3">
              <Checkbox id={filter.id} defaultChecked={filter.checked} />
              <Label htmlFor={filter.id} className="text-sm">
                {filter.label}
              </Label>
            </div>
          ))}
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="ghost" size="sm">
              Reset
            </Button>
          </Sheet.Close>
          <Sheet.Close asChild>
            <Button size="sm">Apply</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
}
