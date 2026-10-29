'use client';

import { useTabState } from '@/hooks/use-tab-state';
import { Tabs } from '@repo/ui/components/tabs';
import type { ComponentProps } from 'react';

type SyncedTabsProps = Omit<
  ComponentProps<typeof Tabs>,
  'value' | 'defaultValue' | 'onValueChange'
> & {
  values: string[];
  defaultValue: string;
  storageKey?: string;
  param?: string;
};

/**
 * Tabs for docs pages that remember the reader's pick across pages through
 * `storageKey` and can be linked to through `param`.
 */
export function SyncedTabs({ values, defaultValue, storageKey, param, ...props }: SyncedTabsProps) {
  const [value, setValue] = useTabState({ values, defaultValue, storageKey, param });
  return <Tabs {...props} value={value} onValueChange={setValue} />;
}
