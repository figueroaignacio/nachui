import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '../../components/button';
import { Flex } from '../../layout/flex';

export function Ghost() {
  return (
    <Flex
      align="center"
      justify="between"
      gap="2"
      className="border-border bg-card w-full max-w-md rounded-xl border p-2 pl-4"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">q3-roadmap.md</p>
        <p className="text-muted-foreground text-xs">Edited by Nadia 4h ago</p>
      </div>
      <Flex align="center" gap="1">
        <Button variant="ghost" size="sm">
          Rename
        </Button>
        <Button variant="ghost" size="sm">
          Duplicate
        </Button>
        <Button variant="ghost" size="icon" aria-label="More actions">
          <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" size={16} />
        </Button>
      </Flex>
    </Flex>
  );
}
