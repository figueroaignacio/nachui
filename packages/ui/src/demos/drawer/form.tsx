'use client';

import { Drawer } from '../../components/drawer';
import { Input } from '../../components/input';
import { Label } from '../../components/label';

const fields = [
  { id: 'name', label: 'Name', defaultValue: 'Ignacio Figueroa', type: 'text' },
  { id: 'username', label: 'Username', defaultValue: '@figueroaignacio', type: 'text' },
] as const;

export function Form() {
  return (
    <Drawer>
      <Drawer.Trigger variant="outline">Edit Profile</Drawer.Trigger>
      <Drawer.Content side="bottom">
        <Drawer.Header>
          <Drawer.Title>Edit profile</Drawer.Title>
          <Drawer.Description>
            Make changes to your profile here. Click save when you&apos;re done.
          </Drawer.Description>
        </Drawer.Header>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                defaultValue={field.defaultValue}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Drawer.Close>Save changes</Drawer.Close>
        </div>
      </Drawer.Content>
    </Drawer>
  );
}
