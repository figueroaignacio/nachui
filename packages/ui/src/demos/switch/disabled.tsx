'use client';

import { Label } from '../../components/label';
import { Switch } from '../../components/switch';

const switches = [{ id: 'disabled-switch', label: 'Airplane Mode' }];

export function Disabled() {
  return (
    <div className="flex flex-col gap-3">
      {switches.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Switch id={item.id} disabled />
          <Label htmlFor={item.id} className="opacity-50">
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
