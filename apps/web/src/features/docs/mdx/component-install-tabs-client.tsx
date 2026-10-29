'use client';

import { useTabState } from '@/hooks/use-tab-state';
import { Tabs } from '@repo/ui/components/tabs';
import { Command } from '@repo/ui/src/components/command';
import type { ReactNode } from 'react';

interface ComponentInstallTabsClientProps {
  component: string;
  manualContent: ReactNode;
}

const CLI_COMMANDS = {
  pnpm: (slug: string) => `pnpm dlx nachui add ${slug}`,
  npm: (slug: string) => `npx nachui add ${slug}`,
  yarn: (slug: string) => `yarn dlx nachui add ${slug}`,
  bun: (slug: string) => `bunx nachui add ${slug}`,
} as const;

type Manager = keyof typeof CLI_COMMANDS;
const MANAGERS: Manager[] = ['pnpm', 'npm', 'yarn', 'bun'];

// The CLI is still being built. Flip this back on once `nachui add` ships.
const CLI_ENABLED = false;

type Method = 'cli' | 'manual';
const METHODS: Method[] = CLI_ENABLED ? ['cli', 'manual'] : ['manual'];

export function ComponentInstallTabsClient({
  component,
  manualContent,
}: ComponentInstallTabsClientProps) {
  const [method, setMethod] = useTabState({
    values: METHODS,
    defaultValue: CLI_ENABLED ? 'cli' : 'manual',
    storageKey: 'install-method',
  });
  const [manager, setManager] = useTabState({
    values: MANAGERS,
    defaultValue: 'pnpm',
    storageKey: 'package-manager',
  });

  return (
    <Tabs value={method} onValueChange={setMethod} className="mt-5 w-full" size="sm">
      <Tabs.List variant="unstyled">
        <Tabs.Trigger value="cli" variant="underline" disabled={!CLI_ENABLED}>
          CLI
        </Tabs.Trigger>
        <Tabs.Trigger value="manual" variant="underline">
          Manual
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="cli" className="mt-4">
        <Tabs value={manager} onValueChange={setManager} className="w-full" size="sm">
          <Tabs.List variant="default">
            {MANAGERS.map((m) => (
              <Tabs.Trigger key={m} value={m}>
                {m}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {MANAGERS.map((m) => (
            <Tabs.Content key={m} value={m} className="mt-5">
              <Command command={CLI_COMMANDS[m](component)} />
            </Tabs.Content>
          ))}
        </Tabs>
      </Tabs.Content>
      <Tabs.Content value="manual" className="mt-4">
        {manualContent}
      </Tabs.Content>
    </Tabs>
  );
}
