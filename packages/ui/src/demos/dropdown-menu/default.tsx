'use client';

import {
  KeyboardIcon,
  Logout02Icon,
  Notification03Icon,
  Settings01Icon,
  Shield02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { DropdownMenu } from '../../components/dropdown-menu';

const menuGroups = [
  {
    label: 'Account',
    items: [
      { icon: UserIcon, label: 'Profile' },
      { icon: Notification03Icon, label: 'Notifications' },
      { icon: Settings01Icon, label: 'Settings' },
    ],
  },
  {
    label: 'Security',
    items: [
      { icon: Shield02Icon, label: 'Privacy & Security' },
      { icon: KeyboardIcon, label: 'Keyboard shortcuts' },
    ],
  },
];

const actionItems = [{ icon: Logout02Icon, label: 'Sign out', destructive: true }];

export function Default() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Account</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56" align="start">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <DropdownMenu.Label>{group.label}</DropdownMenu.Label>
            {group.items.map((item, itemIdx) => (
              <DropdownMenu.Item key={itemIdx}>
                <HugeiconsIcon icon={item.icon} className="mr-2 size-4" />
                {item.label}
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator />
          </div>
        ))}
        {actionItems.map((item, idx) => (
          <DropdownMenu.Item
            key={idx}
            className={item.destructive ? 'text-destructive focus:text-destructive' : ''}
          >
            <HugeiconsIcon icon={item.icon} className="mr-2 size-4" />
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
