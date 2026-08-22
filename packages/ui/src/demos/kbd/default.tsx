import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Kbd } from '../../components/kbd';
import { Flex } from '../../layout/flex';

export function Default() {
  return (
    <Flex
      align="center"
      justify="between"
      gap="3"
      className="border-border bg-card w-full max-w-sm rounded-lg border px-3 py-2"
    >
      <Flex align="center" gap="2" className="text-muted-foreground min-w-0">
        <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0" size={16} />
        <span className="truncate text-sm">Search projects and invoices</span>
      </Flex>
      <Kbd abbrTitle="Slash">/</Kbd>
    </Flex>
  );
}
