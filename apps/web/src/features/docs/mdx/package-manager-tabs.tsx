'use client';

import { Tabs } from '@repo/ui/components/tabs';
import { Command } from '@repo/ui/src/components/command';
import { PackageManagerIcons } from './package-manager-icons';

interface PackageManagerTabsProps {
  command: string;
  managers?: Array<'npm' | 'pnpm' | 'yarn' | 'bun'>;
  defaultManager?: 'npm' | 'pnpm' | 'yarn' | 'bun';
  showLineNumbers?: boolean;
}

const PACKAGE_MANAGERS = {
  npm: {
    name: 'npm',
    icon: PackageManagerIcons.npm,
  },
  pnpm: {
    name: 'pnpm',
    icon: PackageManagerIcons.pnpm,
  },
  yarn: {
    name: 'yarn',
    icon: PackageManagerIcons.yarn,
  },
  bun: {
    name: 'bun',
    icon: PackageManagerIcons.bun,
  },
} as const;

const PACKAGE_MANAGER_COMMANDS = {
  npm: (cmd: string) => `npm install ${cmd}`,
  pnpm: (cmd: string) => `pnpm add ${cmd}`,
  yarn: (cmd: string) => `yarn add ${cmd}`,
  bun: (cmd: string) => `bun add ${cmd}`,
} as const;

export function PackageManagerTabs({
  command,
  managers = ['npm', 'pnpm', 'yarn', 'bun'],
  defaultManager = 'npm',
}: PackageManagerTabsProps) {
  return (
    <Tabs defaultValue={defaultManager} className="mt-5 w-full" size="sm">
      <Tabs.List variant="default">
        {managers.map((manager) => (
          <Tabs.Trigger key={manager} value={manager} className="flex-row gap-2">
            <div>{PACKAGE_MANAGERS[manager].name}</div>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {managers.map((manager) => (
        <Tabs.Content key={manager} value={manager} className="mt-5">
          <Command command={PACKAGE_MANAGER_COMMANDS[manager](command)} />
        </Tabs.Content>
      ))}
    </Tabs>
  );
}
