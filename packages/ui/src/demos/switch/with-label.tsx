'use client';

import { Label } from '../../components/label';
import { Switch } from '../../components/switch';

const switches = [{ id: 'airplane-mode', label: 'Airplane Mode' }];

export function WithLabel() {
  return (
    <div className="flex flex-col gap-3">
      {switches.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Switch id={item.id} />
          <Label htmlFor={item.id}>{item.label}</Label>
        </div>
      ))}
    </div>
  );
}
