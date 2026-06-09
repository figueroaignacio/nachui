'use client';

import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { Popover } from '../../components/popover';

const dimensions = [
  { id: 'width', label: 'Width', defaultValue: '100%' },
  { id: 'height', label: 'Height', defaultValue: '25px' },
] as const;

export function Default() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content showClose>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            {dimensions.map((dim) => (
              <div key={dim.id} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={dim.id}>{dim.label}</Label>
                <Input id={dim.id} defaultValue={dim.defaultValue} className="col-span-2" />
              </div>
            ))}
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}
