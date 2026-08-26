'use client';

import {
  CreditCardIcon,
  Key01Icon,
  Logout02Icon,
  Notification03Icon,
  Settings01Icon,
  UserGroupIcon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '../../components/avatar';
import { Button } from '../../components/button';
import { DropdownMenu } from '../../components/dropdown-menu';

const menuGroups = [
  {
    label: 'Account',
    items: [
      { icon: UserIcon, label: 'Profile', shortcut: '⇧⌘P' },
      { icon: Notification03Icon, label: 'Notifications', shortcut: null },
      { icon: Settings01Icon, label: 'Settings', shortcut: '⌘,' },
    ],
  },
  {
    label: 'Northwind',
    items: [
      { icon: UserGroupIcon, label: 'Team members', shortcut: null },
      { icon: CreditCardIcon, label: 'Usage and billing', shortcut: null },
      { icon: Key01Icon, label: 'API keys', shortcut: null },
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
                  <HugeiconsIcon icon={item.icon} className="mr-2 size-4" />
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
          <HugeiconsIcon icon={Logout02Icon} className="mr-2 size-4" />
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
