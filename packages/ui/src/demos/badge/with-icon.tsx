import { Alert02Icon, Loading02Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '../../components/badge';
import { Flex } from '../../layout/flex';
import { Stack } from '../../layout/stack';

const checks = [
  { name: 'Unit tests', detail: '412 passed in 38s', label: 'Passed', icon: Tick02Icon },
  { name: 'Type check', detail: 'Running on node 22', label: 'Running', icon: Loading02Icon },
  { name: 'Bundle size', detail: '+12kb over budget', label: 'Warning', icon: Alert02Icon },
] as const;

const variants = {
  Passed: 'success',
  Running: 'info',
  Warning: 'warning',
} as const;

export function WithIcon() {
  return (
    <Stack gap="4" className="border-border bg-card w-full max-w-md rounded-xl border p-4">
      {checks.map((check) => (
        <Flex key={check.name} align="center" justify="between" gap="4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{check.name}</p>
            <p className="text-muted-foreground truncate text-xs">{check.detail}</p>
          </div>
          <Badge variant={variants[check.label]}>
            <HugeiconsIcon icon={check.icon} className="size-3" size={12} />
            {check.label}
          </Badge>
        </Flex>
      ))}
    </Stack>
  );
}
