'use client';

import { useTabState } from '@/hooks/use-tab-state';
import { Tabs } from '@repo/ui/components/tabs';
import { Command } from '@repo/ui/src/components/command';
import { PackageManagerIcons } from './package-manager-icons';

type Manager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface PackageManagerTabsProps {
  command: string;
  managers?: Manager[];
  defaultManager?: Manager;
  showLineNumbers?: boolean;
}

const ALL_MANAGERS: Manager[] = ['npm', 'pnpm', 'yarn', 'bun'];

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
  managers = ALL_MANAGERS,
  defaultManager = 'npm',
}: PackageManagerTabsProps) {
  const [manager, setManager] = useTabState({
    values: managers,
    defaultValue: defaultManager,
    storageKey: 'package-manager',
  });

  return (
    <Tabs value={manager} onValueChange={setManager} className="mt-5 w-full" size="sm">
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
