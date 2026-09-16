'use client';

import { Avatar } from '../../components/avatar';
import { Button } from '../../components/button';
import { DropdownMenu } from '../../components/dropdown-menu';
import { BellIcon } from '../../icons/bell';
import { CreditCardIcon } from '../../icons/credit-card';
import { KeyIcon } from '../../icons/key';
import { LogOutIcon } from '../../icons/log-out';
import { SettingsIcon } from '../../icons/settings';
import { UserIcon } from '../../icons/user';
import { UsersIcon } from '../../icons/users';

const menuGroups = [
  {
    label: 'Account',
    items: [
      { icon: UserIcon, label: 'Profile', shortcut: '⇧⌘P' },
      { icon: BellIcon, label: 'Notifications', shortcut: null },
      { icon: SettingsIcon, label: 'Settings', shortcut: '⌘,' },
    ],
  },
  {
    label: 'Northwind',
    items: [
      { icon: UsersIcon, label: 'Team members', shortcut: null },
      { icon: CreditCardIcon, label: 'Usage and billing', shortcut: null },
      { icon: KeyIcon, label: 'API keys', shortcut: null },
    ],
  },
];

export function Default() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Daniela Rojas</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-64 max-w-[calc(100vw-2rem)]" align="start">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar size="sm">
            <Avatar.Fallback>DR</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Daniela Rojas</p>
            <p className="text-muted-foreground truncate text-xs">daniela@northwind.io</p>
          </div>
        </div>
        {menuGroups.map((group) => (
          <div key={group.label}>
            <DropdownMenu.Separator />
            <DropdownMenu.Label>{group.label}</DropdownMenu.Label>
            {group.items.map((item) => (
              <DropdownMenu.Item key={item.label} className="justify-between">
                <span className="flex items-center">
                  <item.icon className="mr-2 size-4" />
                  {item.label}
                </span>
                {item.shortcut && (
                  <span className="text-muted-foreground text-xs">{item.shortcut}</span>
                )}
              </DropdownMenu.Item>
            ))}
          </div>
        ))}
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">
          <LogOutIcon className="mr-2 size-4" />
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
